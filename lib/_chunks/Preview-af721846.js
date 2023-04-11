import { jsx } from 'react/jsx-runtime';
import { SanityDefaultPreview } from 'sanity';
import { useAssetDocumentValues, VideoThumbnail } from './VideoSource.styled-81ae8d6c.js';
const MuxVideoPreview = _ref => {
  let {
    value
  } = _ref;
  const assetDocumentValues = useAssetDocumentValues(value == null ? void 0 : value.asset);
  if (assetDocumentValues.value) {
    return /* @__PURE__ */jsx(VideoThumbnail, {
      asset: assetDocumentValues.value,
      width: 640
    });
  }
  const {
    filename,
    playbackId,
    status
  } = value != null ? value : {};
  return /* @__PURE__ */jsx(SanityDefaultPreview, {
    title: filename || playbackId || "",
    subtitle: status ? "status: ".concat(status) : null
  });
};
export { MuxVideoPreview as default };
//# sourceMappingURL=Preview-af721846.js.map
