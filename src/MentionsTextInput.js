import React, { useState, useEffect, useCallback, useRef, forwardRef } from 'react';
import {View, Animated, TextInput, FlatList, ViewPropTypes, Platform} from 'react-native';
import { position } from 'caret-pos';
import PropTypes from 'prop-types';
import TextAreaAutoSize from 'react-autosize-textarea';


const InputWeb = forwardRef((props, forwardRef) => {
  const inputRef = useRef();

  useEffect(() => {
    forwardRef(inputRef.current)
  }, [inputRef.current])

  return (
    <TextAreaAutoSize 
      {...props}
      ref={inputRef}
      onKeyDown={e => {
        if ((e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') && props.isTrackingStarted) {
          e.preventDefault();
        }

        if (props.onKeyPress) props.onKeyPress(e);
      }}
      onInput={e => {
        if (props.onSelectionChange) props.onSelectionChange({selection: { start: e.target.selectionStart, end: e.target.selectionEnd }});
      }}
      onClick={e => {
        if (props.onClick) props.onClick(e);
        if (props.onSelectionChange) props.onSelectionChange({selection: { start: e.target.selectionStart, end: e.target.selectionEnd }});
      }}
      onChange={e => {
        if (props.onChange) props.onChange(e);
        if (props.onChangeText) props.onChangeText(e.target.value);
        if (props.onContentSizeChange) props.onContentSizeChange({ contentSize: { width: e.target.style.width, height: e.target.style.height, top: position(inputRef.current).top } })
      }}/>
  );
});

const Input = Platform.OS === 'web' ? InputWeb : TextInput;

const MentionsTextInput = (props, forwardedRef) => {
  const [isTrackingStarted, setTracking] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [triggerPosition, setTriggerPosition] = useState(0);
  const [matchTrigger, setMatchTrigger] = useState(new RegExp());
  const [cursor, setCursor] = useState(0);

  const suggestionRowHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const result = props.regex.toString().match(/\/(?<regex>.*)\//);

    if (result.groups && result.groups.regex) {
      const matchString = result.groups.regex.replace(/\\/gm, '\\');

      setMatchTrigger(new RegExp(`(${matchString})(?!.*${matchString})`));
    }
  }, []);

  useEffect(() => {
    if (props.closeMentionList) {
      stopTracking();
    }
  }, [props.closeMentionList]);

  useEffect(() => {
    // reset cursor
    setCursor(0);

    if (props.value === '') {
      stopTracking();
    } else if (isTrackingStarted && !props.horizontal && props.suggestionsData.length !== 0) {
      const numOfRows = (
        props.MaxVisibleRowCount >= props.suggestionsData.length
          ? props.suggestionsData.length
          : props.MaxVisibleRowCount
      );
      const height = numOfRows * props.suggestionRowHeight;
      
      openSuggestionsPanel(height);      
    } else if (props.suggestionsData.length === 0) {
      openSuggestionsPanel(0);
    }
  }, [props.value, props.suggestionsData]);

  const isValidCharTrigger = (char, trigger) => (
    Array.isArray(trigger) 
      ? trigger.includes(char) 
      : (char === trigger)
  )

  const onChangeText = (val) => {
    const {onChangeText, trigger} = props;

    onChangeText(val); // pass changed text back

    if (isValidCharTrigger(val.substr(selection.start, 1), trigger))
      setTriggerPosition(selection.start)

    const lastOcurrence = matchTrigger.exec(val.slice(triggerPosition, selection.end+1));
    const isValidMatch = lastOcurrence && isValidCharTrigger(lastOcurrence[0].charAt(0), trigger)

    if (isValidMatch && !isTrackingStarted) startTracking();

    if (isValidMatch) updateSuggestions(lastOcurrence[0].trim());
    else if (!isValidMatch && isTrackingStarted) stopTracking();
  };

  const closeSuggestionsPanel = useCallback(() => {
    Animated.timing(suggestionRowHeight, {
      toValue: 0,
      duration: 100,
      useNativeDriver: false,
    }).start();
  }, []);

  const updateSuggestions = (lastKeyword) => {
    props.triggerCallback(lastKeyword);
  };

  const openSuggestionsPanel = useCallback((height) => {
    Animated.timing(suggestionRowHeight, {
      toValue: height != null ? height : props.suggestionRowHeight,
      duration: 100,
      useNativeDriver: false
    }).start();
  }, [props.suggestionRowHeight]);

  const startTracking = useCallback(() => {
    openSuggestionsPanel();
    setTracking(true);
    if (props.onTracking) props.onTracking(true)
  }, []);

  const stopTracking = useCallback(() => {
    closeSuggestionsPanel();
    setTracking(false);
    if (props.onTracking) props.onTracking(false)
  }, []);


  const handleOnPress = useCallback((e) => {
    setSelection(e.selection);
    setTriggerPosition(e.selection.end)
  }, [])
  const handleKeyPress = useCallback((e) => {
    if (props.onKeyPress) props.onKeyPress();

    if (Platform.OS === 'web' && isTrackingStarted && props.suggestionsData.length > 0) {
      if (props.suggestionsData.length > 1 ) {
        if (e.key === 'ArrowUp' && cursor > 0) {
          setCursor(cursor-1);
        } else if (e.key === 'ArrowDown' && cursor < props.suggestionsData.length - 1) {
          setCursor(cursor+1);
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
  }, [props.suggestionsData, cursor, stopTracking, selection, isTrackingStarted])

  const renderList = () => (
    <FlatList
      key={cursor}
      listKey={props.listKey || ''}
      keyboardShouldPersistTaps="always"
      horizontal={props.horizontal}
      // ListEmptyComponent={props.loadingComponent}
      enableEmptySections
      data={isTrackingStarted ? props.suggestionsData : []}
      keyExtractor={(item, index) => item.id || index}
      renderItem={({ item, index }) => {
        return props.renderSuggestionsRow(item, stopTracking, cursor === index, handleOnPress);
      }}
    />
  )

  return (
    <View>
      <Input
        onSelectionChange={event => {
          if (props.onSelectionChange) {
            props.onSelectionChange(event.selection || event.nativeEvent.selection);
          }
          setSelection(event.selection || event.nativeEvent.selection);
        }}
        onClick={event => {
          if (props.onClick) {
            props.onClick(event);
          }
        }}
        onContentSizeChange={event => {
          if (props.onContentSizeChange) {
            props.onContentSizeChange(event.contentSize || event.nativeEvent.contentSize);
          }
        }}
        ref={component => {
          if (forwardedRef) {
            forwardedRef(component);
          }
        }}
        onKeyPress={handleKeyPress}
        isTrackingStarted={isTrackingStarted}
        onChangeText={onChangeText}
        multiline={props.multiline}
        value={props.value}
        style={props.textInputStyle}
        placeholderTextColor={props.placeholderTextColor}
        placeholder={props.placeholder ? props.placeholder : 'Write a comment...'}
      />
      <View style={props.panelStyle}>
        {props.withAnimation ? (
          <Animated.View style={[props.suggestionsPanelStyle, {height: suggestionRowHeight}]}>
            {renderList()}
          </Animated.View>
        ) : renderList()}
      </View>
    </View>
  );
}

MentionsTextInput.propTypes = {
  textInputStyle: PropTypes.any,
  suggestionsPanelStyle: PropTypes.any,
  trigger: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  regex: PropTypes.instanceOf(RegExp),
  value: PropTypes.string,
  listKey: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  triggerCallback: PropTypes.func.isRequired,
  renderSuggestionsRow: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
  suggestionsData: PropTypes.array.isRequired,
  horizontal: PropTypes.bool,
  suggestionRowHeight: PropTypes.number.isRequired,
  onEnterItem: PropTypes.func,
  onTracking: PropTypes.func,
  MaxVisibleRowCount(props) {
    if (!props.horizontal && !props.MaxVisibleRowCount) {
      return new Error("Prop 'MaxVisibleRowCount' is required if horizontal is set to false.");
    }
  },
  multiline: PropTypes.bool,
  withAnimation: PropTypes.bool
};

MentionsTextInput.defaultProps = {
  textInputStyle: {borderColor: '#ebebeb', borderWidth: 1, fontSize: 15},
  suggestionsPanelStyle: {backgroundColor: 'rgba(100,100,100,0.1)'},
  horizontal: true,
  multiline: true,
  withAnimation: true
};

export default forwardRef(MentionsTextInput);
