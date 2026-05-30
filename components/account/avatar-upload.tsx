"use client";

import { useActionState, useRef, useState } from "react";
import Image from "next/image";
import { Camera, Loader2 } from "lucide-react";
import { updateAvatarAction, type AvatarState } from "@/actions/profile";

interface AvatarUploadProps {
  currentImage: string | null;
  userName: string | null;
}

const initialState: AvatarState = {};

export function AvatarUpload({ currentImage, userName }: AvatarUploadProps) {
  const [state, formAction, isPending] = useActionState(
    updateAvatarAction,
    initialState,
  );
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const displayImage = preview ?? currentImage;
  const initial = userName?.[0]?.toUpperCase() ?? "U";

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    // auto-submit when file is chosen
    formRef.current?.requestSubmit();
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        {/* Avatar */}
        <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-accent-600 text-white flex items-center justify-center text-3xl font-bold select-none">
          {displayImage ? (
            <Image
              src={displayImage}
              alt="Profile picture"
              fill
              sizes="96px"
              className="object-cover"
              unoptimized
            />
          ) : (
            initial
          )}
        </div>

        {/* Camera button overlay */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="absolute bottom-0 right-0 grid h-8 w-8 place-items-center rounded-full border-2 border-surface bg-accent-600 text-white shadow-md hover:bg-accent-700 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Change profile picture"
        >
          {isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Camera className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* Hidden form handles the actual upload */}
      <form ref={formRef} action={formAction}>
        <input
          ref={inputRef}
          type="file"
          name="avatar"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="sr-only"
          onChange={handleFileChange}
          aria-hidden="true"
          tabIndex={-1}
        />
      </form>

      {state.error && (
        <p className="text-xs font-medium text-red-600">{state.error}</p>
      )}
      {state.message && (
        <p className="text-xs font-medium text-green-600">{state.message}</p>
      )}

      <p className="text-xs text-foreground-muted text-center">
        Click the camera icon to upload
        <br />
        JPEG · PNG · WebP · GIF &mdash; max 5 MB
      </p>
    </div>
  );
}
