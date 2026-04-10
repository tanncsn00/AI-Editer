"""EverAI Text-to-Speech provider (Vietnamese-native).

EverAI is a Vietnamese TTS service with premium Vietnamese voices
(Northern, Central, Southern accents) plus multilingual defaults.
Strong choice for Vietnamese-language video narration, especially
contemplative / philosophical content where a native speaker is required.

Docs: https://help.everai.vn/api-docs/text-to-speech/post-text-to-speech
"""

from __future__ import annotations

import os
import time
from pathlib import Path
from typing import Any

from tools.base_tool import (
    BaseTool,
    Determinism,
    ExecutionMode,
    ResourceProfile,
    RetryPolicy,
    ToolResult,
    ToolRuntime,
    ToolStability,
    ToolStatus,
    ToolTier,
)


class EverAITTS(BaseTool):
    name = "everai_tts"
    version = "0.1.0"
    tier = ToolTier.VOICE
    capability = "tts"
    provider = "everai_tts"
    stability = ToolStability.BETA
    execution_mode = ExecutionMode.SYNC
    determinism = Determinism.DETERMINISTIC
    runtime = ToolRuntime.API

    dependencies = []
    install_instructions = (
        "Set EVERAI_API_KEY to your EverAI API key.\n"
        "  Create one at https://everai.vn/api"
    )
    fallback = "elevenlabs_tts"
    fallback_tools = ["elevenlabs_tts", "google_tts", "openai_tts"]
    agent_skills = ["text-to-speech"]

    capabilities = [
        "text_to_speech",
        "voice_selection",
        "multilingual",
        "vietnamese_native",
        "srt_generation",
    ]
    supports = {
        "voice_cloning": False,
        "multilingual": True,
        "offline": False,
        "native_audio": True,
        "vietnamese_regional_accents": True,
    }
    best_for = [
        "Vietnamese narration (native quality, regional accents)",
        "long-form Vietnamese content (explainers, philosophy, storytelling)",
        "affordable Vietnamese TTS with SRT export",
    ]
    not_good_for = [
        "voice cloning",
        "non-Vietnamese premium quality (use ElevenLabs instead)",
    ]

    # EverAI Vietnamese voices — name → region/gender
    VIETNAMESE_VOICES = {
        # North (mb)
        "vi_female_thuytrang_mb": "North female — warm narrator",
        "vi_female_hacuc_mb": "North female — gentle, contemplative",
        "vi_female_huyenanh_mb": "North female — bright",
        "vi_female_halinh_mb": "North female — clear",
        "vi_female_hoaian_mb": "North female — soft",
        "vi_female_khanhhuyentvc_mb": "North female — TV broadcast",
        "vi_male_lehoang_mb": "North male — deep narrator",
        "vi_male_minhtriet_mb": "North male — wise/philosophical (default for reflective content)",
        "vi_male_ductrong_mb": "North male — grounded, serious",
        # South (mn)
        "vi_female_kieunhi_mn": "South female — warm",
        # Multilingual defaults
        "vi_male_echo_default": "Default male (multi-accent)",
        "vi_female_nova_default": "Default female (multi-accent)",
        "vi_male_onyx_default": "Default male (deep)",
    }

    DEFAULT_VOICE = "vi_male_minhtriet_mb"

    input_schema = {
        "type": "object",
        "required": ["text"],
        "properties": {
            "text": {"type": "string", "description": "Text to convert to speech"},
            "voice": {
                "type": "string",
                "default": DEFAULT_VOICE,
                "description": "EverAI voice_code (e.g. vi_male_minhtriet_mb)",
            },
            "model_id": {
                "type": "string",
                "default": "everai-v1.5",
                "enum": ["everai-v1.6", "everai-v1.5", "everai-v1.5-turbo", "everai-v1"],
            },
            "audio_type": {
                "type": "string",
                "default": "mp3",
                "enum": ["mp3", "wav"],
            },
            "bitrate": {
                "type": "integer",
                "default": 128,
                "enum": [8, 16, 32, 64, 128, 160],
            },
            "speed_rate": {
                "type": "number",
                "default": 1.0,
                "minimum": 0.5,
                "maximum": 2.0,
            },
            "pitch_rate": {
                "type": "number",
                "default": 1.0,
                "minimum": 0.5,
                "maximum": 2.0,
            },
            "volume": {
                "type": "integer",
                "default": 100,
                "minimum": 50,
                "maximum": 150,
            },
            "generate_srt": {
                "type": "boolean",
                "default": False,
            },
            "output_path": {"type": "string"},
        },
    }

    resource_profile = ResourceProfile(
        cpu_cores=1, ram_mb=256, vram_mb=0, disk_mb=50, network_required=True
    )
    retry_policy = RetryPolicy(max_retries=2, retryable_errors=["rate_limit", "timeout"])
    idempotency_key_fields = ["text", "voice", "model_id", "speed_rate", "pitch_rate"]
    side_effects = ["writes audio file to output_path", "calls EverAI TTS API"]
    user_visible_verification = ["Listen to generated audio for natural Vietnamese speech"]

    API_ENDPOINT = "https://www.everai.vn/api/v1/tts"
    POLL_INTERVAL_SECONDS = 2
    POLL_MAX_ATTEMPTS = 60

    def _get_api_key(self) -> str | None:
        return os.environ.get("EVERAI_API_KEY")

    def get_status(self) -> ToolStatus:
        return ToolStatus.AVAILABLE if self._get_api_key() else ToolStatus.UNAVAILABLE

    def estimate_cost(self, inputs: dict[str, Any]) -> float:
        # Pricing (from docs): premium VN voices = 1000 credits / 1000 chars.
        # Credit-to-USD rate is not published; report as 0 until confirmed.
        # Track characters for budget accounting instead.
        return 0.0

    def execute(self, inputs: dict[str, Any]) -> ToolResult:
        api_key = self._get_api_key()
        if not api_key:
            return ToolResult(
                success=False,
                error="No EVERAI_API_KEY found. " + self.install_instructions,
            )

        start = time.time()
        try:
            result = self._generate(inputs, api_key)
        except Exception as exc:
            return ToolResult(success=False, error=f"EverAI TTS failed: {exc}")

        result.duration_seconds = round(time.time() - start, 2)
        result.cost_usd = self.estimate_cost(inputs)
        return result

    def _poll_result(self, request_id: str, api_key: str) -> str | None:
        """Poll GET /api/v1/tts/{request_id} until audio_link is ready."""
        import requests

        url = f"https://www.everai.vn/api/v1/tts/{request_id}"
        headers = {"Authorization": f"Bearer {api_key}"}

        for _ in range(self.POLL_MAX_ATTEMPTS):
            try:
                resp = requests.get(url, headers=headers, timeout=30)
                if resp.status_code == 200:
                    body = resp.json()
                    result = body.get("result") or {}
                    status = (result.get("status") or "").lower()
                    audio_link = result.get("audio_link")
                    if audio_link and status in ("done", "success", "finished"):
                        return audio_link
                    if status in ("failed", "failure", "error"):
                        return None
            except Exception:
                pass
            time.sleep(self.POLL_INTERVAL_SECONDS)
        return None

    def _generate(self, inputs: dict[str, Any], api_key: str) -> ToolResult:
        import requests

        text = inputs["text"]
        voice = inputs.get("voice", self.DEFAULT_VOICE)
        model_id = inputs.get("model_id", "everai-v1.5")
        audio_type = inputs.get("audio_type", "mp3")
        bitrate = inputs.get("bitrate", 128)
        speed_rate = inputs.get("speed_rate", 1.0)
        pitch_rate = inputs.get("pitch_rate", 1.0)
        volume = inputs.get("volume", 100)
        generate_srt = inputs.get("generate_srt", False)

        payload = {
            "input_text": text,
            "voice_code": voice,
            "model_id": model_id,
            "audio_type": audio_type,
            "bitrate": bitrate,
            "speed_rate": speed_rate,
            "pitch_rate": pitch_rate,
            "volume": volume,
            "generate_srt": generate_srt,
        }

        response = requests.post(
            self.API_ENDPOINT,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=180,
        )
        response.raise_for_status()
        body = response.json()

        if body.get("status") != 1:
            return ToolResult(
                success=False,
                error=f"EverAI error {body.get('error_code')}: {body.get('error_message')}",
                data=body,
            )

        result_obj = body.get("result", {})
        request_id = result_obj.get("request_id")
        audio_link = result_obj.get("audio_link") or body.get("audio_link")

        # EverAI TTS is async by default — poll callback-result for audio_link.
        if not audio_link:
            if not request_id:
                return ToolResult(
                    success=False,
                    error="EverAI response missing both audio_link and request_id.",
                    data=body,
                )
            audio_link = self._poll_result(request_id, api_key)
            if not audio_link:
                return ToolResult(
                    success=False,
                    error=f"EverAI TTS timed out waiting for audio_link (request_id={request_id}).",
                    data=body,
                )

        ext = audio_type
        output_path = Path(inputs.get("output_path", f"everai_tts_output.{ext}"))
        output_path.parent.mkdir(parents=True, exist_ok=True)

        audio_resp = requests.get(audio_link, timeout=120)
        audio_resp.raise_for_status()
        output_path.write_bytes(audio_resp.content)

        return ToolResult(
            success=True,
            data={
                "provider": self.provider,
                "voice": voice,
                "model_id": model_id,
                "text_length": len(text),
                "output": str(output_path),
                "format": audio_type,
                "speed_rate": speed_rate,
                "pitch_rate": pitch_rate,
                "audio_link": audio_link,
                "request_id": result_obj.get("request_id"),
            },
            artifacts=[str(output_path)],
            model=f"everai/{model_id}/{voice}",
        )
