"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactNative = require("react-native");

var _caretPos = require("caret-pos");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactAutosizeTextarea = _interopRequireDefault(require("react-autosize-textarea"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const suggestionRowHeight = new _reactNative.Animated.Value(0);
const InputWeb = /*#__PURE__*/(0, _react.forwardRef)((props, forwardRef) => {
  const inputRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    forwardRef(inputRef.current);
  }, [inputRef.current]);
  return /*#__PURE__*/_react.default.createElement(_reactAutosizeTextarea.default, _extends({}, props, {
    ref: inputRef,
    onInput: e => {
      if (props.onSelectionChange) props.onSelectionChange({
        selection: {
          start: e.target.selectionStart,
          end: e.target.selectionEnd
        }
      });
    },
    onClick: e => {
      if (props.onClick) props.onClick(e);
      if (props.onSelectionChange) props.onSelectionChange({
        selection: {
          start: e.target.selectionStart,
          end: e.target.selectionEnd
        }
      });
    },
    onChange: e => {
      if (props.onChange) props.onChange(e);
      if (props.onChangeText) props.onChangeText(e.target.value);
      if (props.onContentSizeChange) props.onContentSizeChange({
        contentSize: {
          width: e.target.style.width,
          height: e.target.style.height,
          top: (0, _caretPos.position)(inputRef.current).top
        }
      });
    }
  }));
});
const Input = _reactNative.Platform.OS === 'web' ? InputWeb : _reactNative.TextInput;

const MentionsTextInput = (props, forwardedRef) => {
  const [isTrackingStarted, setTracking] = (0, _react.useState)(false);
  const [selection, setSelection] = (0, _react.useState)({
    start: 0,
    end: 0
  });
  const [previousChar, setPreviousChar] = (0, _react.useState)(' ');
  (0, _react.useEffect)(() => {
    if (props.value === '') {
      resetTextbox();
    } else if (isTrackingStarted && !props.horizontal && props.suggestionsData.length !== 0) {
      const numOfRows = props.MaxVisibleRowCount >= props.suggestionsData.length ? props.suggestionsData.length : props.MaxVisibleRowCount;
      const height = numOfRows * props.suggestionRowHeight;
      openSuggestionsPanel(height);
    } else if (props.suggestionsData.length === 0) {
      openSuggestionsPanel(0);
    }
  }, [props.value, props.suggestionsData.length]);
  const onChangeText = (0, _react.useCallback)(val => {
    const {
      onChangeText,
      triggerLocation,
      trigger
    } = props;
    onChangeText(val); // pass changed text back

    const lastChar = val.substr(selection.end, 1);
    const wordBoundry = triggerLocation === 'new-word-only' ? previousChar.trim().length === 0 : true;

    if ((lastChar === trigger || val.substr(selection.end + 1, 1) === trigger || val.substr(selection.end - 1, 1) === trigger) && wordBoundry) {
      startTracking();
    } else if (previousChar === trigger && val.substr(selection.end + 1, 1) !== trigger && val.substr(selection.end - 1, 1) !== trigger && isTrackingStarted && lastChar.trim() === '') {
      stopTracking();
    }

    setPreviousChar(lastChar);
    identifyKeyword(val);
  }, [previousChar, selection, isTrackingStarted]);
  const closeSuggestionsPanel = (0, _react.useCallback)(() => {
    _reactNative.Animated.timing(suggestionRowHeight, {
      toValue: 0,
      duration: 100
    }).start();
  }, [suggestionRowHeight]);
  const updateSuggestions = (0, _react.useCallback)(lastKeyword => {
    props.triggerCallback(lastKeyword);
  }, []);
  const identifyKeyword = (0, _react.useCallback)(val => {
    const {
      triggerLocation,
      trigger
    } = props;

    if (isTrackingStarted) {
      const boundary = triggerLocation === 'new-word-only' ? 'B' : '';
      const pattern = props.regex ? props.regex : new RegExp(`\\${boundary}${trigger}[a-z0-9_-]+|\\${boundary}${trigger}`, 'gi');
      const keywordArray = val.substr(0, selection.end + 1).match(pattern);

      if (keywordArray && !!keywordArray.length) {
        const lastKeyword = keywordArray[keywordArray.length - 1];
        updateSuggestions(lastKeyword);
      } else {
        stopTracking();
      }
    }
  }, [isTrackingStarted, selection]);
  const openSuggestionsPanel = (0, _react.useCallback)(height => {
    _reactNative.Animated.timing(suggestionRowHeight, {
      toValue: height != null ? height : props.suggestionRowHeight,
      duration: 100
    }).start();
  }, [props.suggestionRowHeight]);
  const startTracking = (0, _react.useCallback)(() => {
    openSuggestionsPanel();
    setTracking(true);
  }, []);
  const stopTracking = (0, _react.useCallback)(() => {
    closeSuggestionsPanel();
    setTracking(false);
  }, []);
  const resetTextbox = (0, _react.useCallback)(() => {
    setPreviousChar(' ');
    stopTracking();
  }, []);
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, null, /*#__PURE__*/_react.default.createElement(Input, {
    onSelectionChange: event => {
      if (props.onSelectionChange) {
        props.onSelectionChange(event.selection || event.nativeEvent.selection);
      }

      setSelection(event.selection || event.nativeEvent.selection);
    },
    onClick: event => {
      if (props.onClick) {
        props.onClick(event);
      }
    },
    onContentSizeChange: event => {
      if (props.onContentSizeChange) {
        props.onContentSizeChange(event.contentSize || event.nativeEvent.contentSize);
      }
    },
    ref: component => {
      if (forwardedRef) {
        forwardedRef(component);
      }
    },
    isTrackingStarted: isTrackingStarted,
    onChangeText: onChangeText,
    multiline: props.multiline,
    value: props.value,
    style: props.textInputStyle,
    placeholder: props.placeholder ? props.placeholder : 'Write a comment...'
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: props.panelStyle
  }, /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
    style: [props.suggestionsPanelStyle, {
      height: suggestionRowHeight
    }]
  }, /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, {
    keyboardShouldPersistTaps: "always",
    horizontal: props.horizontal,
    ListEmptyComponent: props.loadingComponent,
    enableEmptySections: true,
    data: props.suggestionsData,
    keyExtractor: props.keyExtractor,
    renderItem: rowData => {
      return props.renderSuggestionsRow(rowData, stopTracking, e => {
        setSelection(e.selection);
        setPreviousChar('');
      });
    }
  }))));
};

MentionsTextInput.propTypes = {
  textInputStyle: _reactNative.TextInput.propTypes.style,
  suggestionsPanelStyle: _reactNative.ViewPropTypes.style,
  loadingComponent: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.element]),
  trigger: _propTypes.default.string.isRequired,
  regex: _propTypes.default.instanceOf(RegExp),
  triggerLocation: _propTypes.default.oneOf(['new-word-only', 'anywhere']).isRequired,
  value: _propTypes.default.string,
  onChangeText: _propTypes.default.func.isRequired,
  triggerCallback: _propTypes.default.func.isRequired,
  renderSuggestionsRow: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.element]).isRequired,
  suggestionsData: _propTypes.default.array.isRequired,
  keyExtractor: _propTypes.default.func.isRequired,
  horizontal: _propTypes.default.bool,
  suggestionRowHeight: _propTypes.default.number.isRequired,

  MaxVisibleRowCount(props, propName, componentName) {
    if (!props.horizontal && !props.MaxVisibleRowCount) {
      return new Error("Prop 'MaxVisibleRowCount' is required if horizontal is set to false.");
    }
  },

  multiline: _propTypes.default.bool
};
MentionsTextInput.defaultProps = {
  textInputStyle: {
    borderColor: '#ebebeb',
    borderWidth: 1,
    fontSize: 15
  },
  suggestionsPanelStyle: {
    backgroundColor: 'rgba(100,100,100,0.1)'
  },
  loadingComponent: () => /*#__PURE__*/_react.default.createElement(_reactNative.Text, null, "Loading..."),
  horizontal: true,
  multiline: true
};

var _default = /*#__PURE__*/(0, _react.forwardRef)(MentionsTextInput);

exports.default = _default;