/**
 * Google Drive Media Helper for Northfold Case Study Site
 *
 * Rules:
 * 1. Extract File ID from various Drive sharing formats.
 * 2. Convert to reliable direct image URL: `https://lh3.googleusercontent.com/d/FILE_ID`
 * 3. Convert to embeddable preview for video: `https://drive.google.com/file/d/FILE_ID/preview`
 * 4. Validate and surface warnings when sharing permissions are not public.
 */

export interface ParsedDriveMedia {
  fileId: string | null;
  isValid: boolean;
  type: "image" | "video" | "unknown";
  directImageUrl: string;
  embedVideoUrl: string;
  originalUrl: string;
  warning?: string;
}

export function parseDriveUrl(inputUrl: string, mediaTypeHint: "image" | "video" = "image"): ParsedDriveMedia {
  if (!inputUrl || typeof inputUrl !== "string") {
    return {
      fileId: null,
      isValid: false,
      type: mediaTypeHint,
      directImageUrl: "",
      embedVideoUrl: "",
      originalUrl: "",
      warning: "Please enter a valid Google Drive link or file ID."
    };
  }

  const trimmed = inputUrl.trim();

  // If user pasted bare file ID (typically alphanumeric + underscores/hyphens, length 25-45)
  const isBareId = /^[a-zA-Z0-9_-]{25,45}$/.test(trimmed);
  let fileId: string | null = null;

  if (isBareId) {
    fileId = trimmed;
  } else {
    // Check various Drive URL formats
    const fileDMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const idParamMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    const openIdMatch = trimmed.match(/\/open\?id=([a-zA-Z0-9_-]+)/);
    const ucIdMatch = trimmed.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);

    fileId = fileDMatch?.[1] || idParamMatch?.[1] || openIdMatch?.[1] || ucIdMatch?.[1] || null;
  }

  if (!fileId) {
    // If it's a regular external URL (e.g. unsplash fallback or custom CDN)
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return {
        fileId: null,
        isValid: true,
        type: mediaTypeHint,
        directImageUrl: trimmed,
        embedVideoUrl: trimmed,
        originalUrl: trimmed,
        warning: undefined
      };
    }

    return {
      fileId: null,
      isValid: false,
      type: mediaTypeHint,
      directImageUrl: "",
      embedVideoUrl: "",
      originalUrl: trimmed,
      warning: "Could not extract a valid Google Drive file ID. Ensure link resembles https://drive.google.com/file/d/FILE_ID/view"
    };
  }

  // Detect type if hints suggest video or if user selected video
  const isVideoHint = mediaTypeHint === "video" || trimmed.includes("video") || trimmed.includes("preview");
  const type: "image" | "video" = isVideoHint ? "video" : "image";

  // Googleusercontent direct image CDN
  const directImageUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
  // Drive embed iframe preview
  const embedVideoUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return {
    fileId,
    isValid: true,
    type,
    directImageUrl,
    embedVideoUrl,
    originalUrl: trimmed,
    warning: "Important: Ensure your Drive file's General Access is set to 'Anyone with the link can view', or media will not display publicly."
  };
}

/**
 * Returns safe image source with fallback for broken media
 */
export function getSafeImageSrc(media: { directImageUrl?: string; fallback_url?: string; drive_id?: string } | undefined, defaultPlaceholder = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"): string {
  if (!media) return defaultPlaceholder;
  if (media.directImageUrl && media.directImageUrl.length > 5) return media.directImageUrl;
  if (media.drive_id) return `https://lh3.googleusercontent.com/d/${media.drive_id}`;
  if (media.fallback_url && media.fallback_url.length > 5) return media.fallback_url;
  return defaultPlaceholder;
}
