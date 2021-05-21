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

function _wrapRegExp(re, groups) { _wrapRegExp = function (re, groups) { return new BabelRegExp(re, undefined, groups); }; var _RegExp = _wrapNativeSuper(RegExp); var _super = RegExp.prototype; var _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = _RegExp.call(this, re, flags); _groups.set(_this, groups || _groups.get(re)); return _this; } _inherits(BabelRegExp, _RegExp); BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) result.groups = buildGroups(result, this); return result; }; BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if (typeof substitution === "string") { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { return "$" + groups[name]; })); } else if (typeof substitution === "function") { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = []; args.push.apply(args, arguments); if (typeof args[args.length - 1] !== "object") { args.push(buildGroups(args, _this)); } return substitution.apply(this, args); }); } else { return _super[Symbol.replace].call(this, str, substitution); } }; function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { groups[name] = result[g[name]]; return groups; }, Object.create(null)); } return _wrapRegExp.apply(this, arguments); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _possibleConstructorReturn(self, call) { if (call && (typeof call === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

const InputWeb = /*#__PURE__*/(0, _react.forwardRef)((props, forwardRef) => {
  const inputRef = (0, _react.useRef)();
  (0, _react.useEffect)(() => {
    forwardRef(inputRef.current);
  }, [inputRef.current]);
  return /*#__PURE__*/_react.default.createElement(_reactAutosizeTextarea.default, _extends({}, props, {
    ref: inputRef,
    onKeyDown: e => {
      if ((e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') && props.isTrackingStarted) {
        e.preventDefault();
      }

      if (props.onKeyPress) props.onKeyPress(e);
    },
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
  const [triggerPosition, setTriggerPosition] = (0, _react.useState)(0);
  const [matchTrigger, setMatchTrigger] = (0, _react.useState)(new RegExp());
  const [cursor, setCursor] = (0, _react.useState)(0);
  const suggestionRowHeight = (0, _react.useRef)(new _reactNative.Animated.Value(0)).current;
  (0, _react.useEffect)(() => {
    const result = props.regex.toString().match( /*#__PURE__*/_wrapRegExp(/\/(.*)\//, {
      regex: 1
    }));

    if (result.groups && result.groups.regex) {
      const matchString = result.groups.regex.replace(/\\/gm, '\\');
      setMatchTrigger(new RegExp(`(${matchString})(?!.*${matchString})`));
    }
  }, []);
  (0, _react.useEffect)(() => {
    if (props.closeMentionList) {
      stopTracking();
    }
  }, [props.closeMentionList]);
  (0, _react.useEffect)(() => {
    // reset cursor
    setCursor(0);

    if (props.value === '') {
      stopTracking();
    } else if (isTrackingStarted && !props.horizontal && props.suggestionsData.length !== 0) {
      const numOfRows = props.MaxVisibleRowCount >= props.suggestionsData.length ? props.suggestionsData.length : props.MaxVisibleRowCount;
      const height = numOfRows * props.suggestionRowHeight;
      openSuggestionsPanel(height);
    } else if (props.suggestionsData.length === 0) {
      openSuggestionsPanel(0);
    }
  }, [props.value, props.suggestionsData]);

  const isValidCharTrigger = (char, trigger) => Array.isArray(trigger) ? trigger.includes(char) : char === trigger;

  const onChangeText = val => {
    const {
      onChangeText,
      trigger
    } = props;
    onChangeText(val); // pass changed text back

    if (isValidCharTrigger(val.substr(selection.start, 1), trigger)) setTriggerPosition(selection.start);
    const lastOcurrence = matchTrigger.exec(val.slice(triggerPosition, selection.end + 1));
    const isValidMatch = lastOcurrence && isValidCharTrigger(lastOcurrence[0].charAt(0), trigger);
    if (isValidMatch && !isTrackingStarted) startTracking();
    if (isValidMatch) updateSuggestions(lastOcurrence[0].trim());else if (!isValidMatch && isTrackingStarted) stopTracking();
  };

  const closeSuggestionsPanel = (0, _react.useCallback)(() => {
    _reactNative.Animated.timing(suggestionRowHeight, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, []);

  const updateSuggestions = lastKeyword => {
    props.triggerCallback(lastKeyword);
  };

  const openSuggestionsPanel = (0, _react.useCallback)(height => {
    _reactNative.Animated.timing(suggestionRowHeight, {
      toValue: height != null ? height : props.suggestionRowHeight,
      duration: 100,
      useNativeDriver: true,
    }).start();
  }, [props.suggestionRowHeight]);
  const startTracking = (0, _react.useCallback)(() => {
    openSuggestionsPanel();
    setTracking(true);
    if (props.onTracking) props.onTracking(true);
  }, []);
  const stopTracking = (0, _react.useCallback)(() => {
    closeSuggestionsPanel();
    setTracking(false);
    if (props.onTracking) props.onTracking(false);
  }, []);
  const handleOnPress = (0, _react.useCallback)(e => {
    setSelection(e.selection);
    setTriggerPosition(e.selection.end);
  }, []);
  const handleKeyPress = (0, _react.useCallback)(e => {
    if (props.onKeyPress) props.onKeyPress();

    if (_reactNative.Platform.OS === 'web' && isTrackingStarted && props.suggestionsData.length > 0) {
      if (props.suggestionsData.length > 1) {
        if (e.key === 'ArrowUp' && cursor > 0) {
          setCursor(cursor - 1);
        } else if (e.key === 'ArrowDown' && cursor < props.suggestionsData.length - 1) {
          setCursor(cursor + 1);
        }
      }

      if (e.key === 'Escape') {
        stopTracking();
        setTriggerPosition(selection.end);
      }

      if (e.key === 'Enter') {
        props.onEnterItem(props.suggestionsData[cursor], stopTracking, handleOnPress);
      }
    }
  }, [props.suggestionsData, cursor, stopTracking, selection, isTrackingStarted]);

  const renderList = () => /*#__PURE__*/_react.default.createElement(_reactNative.FlatList, {
    key: cursor,
    listKey: props.listKey ? props.listKey : '',
    keyboardShouldPersistTaps: "always",
    horizontal: props.horizontal // ListEmptyComponent={props.loadingComponent}
    ,
    enableEmptySections: true,
    data: isTrackingStarted ? props.suggestionsData : [],
    keyExtractor: (item, index) => item.id || index,
    renderItem: ({
      item,
      index
    }) => {
      return props.renderSuggestionsRow(item, stopTracking, cursor === index, handleOnPress);
    }
  });

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
    onKeyPress: handleKeyPress,
    isTrackingStarted: isTrackingStarted,
    onChangeText: onChangeText,
    multiline: props.multiline,
    value: props.value,
    style: props.textInputStyle,
    placeholder: props.placeholder ? props.placeholder : 'Write a comment...'
  }), /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: props.panelStyle
  }, props.withAnimation ? /*#__PURE__*/_react.default.createElement(_reactNative.Animated.View, {
    style: [props.suggestionsPanelStyle, {
      height: suggestionRowHeight
    }]
  }, renderList()) : renderList()));
};

MentionsTextInput.propTypes = {
  textInputStyle: _propTypes.default.any,
  suggestionsPanelStyle: _propTypes.default.any,
  trigger: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.array]).isRequired,
  regex: _propTypes.default.instanceOf(RegExp),
  value: _propTypes.default.string,
  listKey: _propTypes.default.string,
  onChangeText: _propTypes.default.func.isRequired,
  triggerCallback: _propTypes.default.func.isRequired,
  renderSuggestionsRow: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.element]).isRequired,
  suggestionsData: _propTypes.default.array.isRequired,
  horizontal: _propTypes.default.bool,
  suggestionRowHeight: _propTypes.default.number.isRequired,
  onEnterItem: _propTypes.default.func,
  onTracking: _propTypes.default.func,

  MaxVisibleRowCount(props) {
    if (!props.horizontal && !props.MaxVisibleRowCount) {
      return new Error("Prop 'MaxVisibleRowCount' is required if horizontal is set to false.");
    }
  },

  multiline: _propTypes.default.bool,
  withAnimation: _propTypes.default.bool
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
  horizontal: true,
  multiline: true,
  withAnimation: true
};

var _default = /*#__PURE__*/(0, _react.forwardRef)(MentionsTextInput);

exports.default = _default;
