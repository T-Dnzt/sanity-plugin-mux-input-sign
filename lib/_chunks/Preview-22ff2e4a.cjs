'use strict';

var jsxRuntime = require('react/jsx-runtime');
var sanity = require('sanity');
var VideoSource_styled = require('./VideoSource.styled-dda7be42.cjs');
const MuxVideoPreview = _ref => {
  let {
    value
  } = _ref;
  const assetDocumentValues = VideoSource_styled.useAssetDocumentValues(value == null ? void 0 : value.asset);
  if (assetDocumentValues.value) {
    return /* @__PURE__ */jsxRuntime.jsx(VideoSource_styled.VideoThumbnail, {
      asset: assetDocumentValues.value,
      width: 640
    });
  }
  const {
    filename,
    playbackId,
    status
  } = value != null ? value : {};
  return /* @__PURE__ */jsxRuntime.jsx(sanity.SanityDefaultPreview, {
    title: filename || playbackId || "",
    subtitle: status ? "status: ".concat(status) : null
  });
};
exports.default = MuxVideoPreview;
//# sourceMappingURL=Preview-22ff2e4a.cjs.map
