import React, { useState, useEffect } from 'react'
import {Text, View, Animated, TextInput, FlatList, ViewPropTypes} from 'react-native'
import PropTypes from 'prop-types'

const MentionsTextInput = (props) => {
  const {
    horizontal,
    loadingComponent,
    suggestionsData,
    keyExtractor,
    renderSuggestionsRow,
    suggestionsPanelStyle = {},
    textInputStyle = {},
    textInputMinHeight,
    value,
    textInputMaxHeight,
    placeholder,
    multiline
  } = props

  const [state, setState] = useState({
    textInputHeight: '',
    isTrackingStarted: false,
    suggestionRowHeight: new Animated.Value(0),
    selection: {start: 0, end: 0},
  });

  const {suggestionRowHeight, textInputHeight} = state
  
  let isTrackingStarted = false
  let previousChar = ' ';

  useEffect(() => {
    setState({
      textInputHeight: props.textInputMinHeight
    })
  }, [])

  useEffect(() => {
    if (!value) {
      resetTextbox()
    } else if (isTrackingStarted && !horizontal && suggestionsData.length !== 0) {
      const numOfRows =
        MaxVisibleRowCount >= suggestionsData.length
          ? suggestionsData.length
          : MaxVisibleRowCount
      const height = numOfRows * suggestionRowHeight
      openSuggestionsPanel(height)
    } else if (suggestionsData.length === 0) {
      openSuggestionsPanel(0)
    }
  }, [props.value])


  const onChangeText = (val) =>  {
    const {onChangeText, triggerLocation, trigger} = props
    const {isTrackingStarted} = state

    onChangeText(val) // pass changed text back
    const lastChar = val.substr(state.selection.end, 1)
    const wordBoundry = triggerLocation === 'new-word-only' ? previousChar.trim().length === 0 : true
    if (lastChar === trigger.charAt(0) && wordBoundry) {
      startTracking()
    } else if ((lastChar === ' ' && isTrackingStarted) || val === '') {
      stopTracking()
    }
    previousChar = lastChar
    identifyKeyword(val)
  }

  const closeSuggestionsPanel = () => {
    Animated.timing(state.suggestionRowHeight, {
      toValue: 0,
      duration: 100,
    }).start()
  }

  const updateSuggestions = (lastKeyword) => {
    props.triggerCallback(lastKeyword)
  }

  const identifyKeyword = (val) => {
    const {triggerLocation, trigger} = props
    if (isTrackingStarted) {
      const boundary = triggerLocation === 'new-word-only' ? 'B' : ''
      const pattern = new RegExp(`\\${boundary}${trigger}[a-z0-9_-]+|\\${boundary}${trigger}`, 'gi')
      const keywordArray = val.substr(0, state.selection.end + 1).match(pattern)
      if (keywordArray && !!keywordArray.length) {
        const lastKeyword = keywordArray[keywordArray.length - 1]
        updateSuggestions(lastKeyword)
      }
    }
  }

  const openSuggestionsPanel = (height) => {
    Animated.timing(state.suggestionRowHeight, {
      toValue: height != null ? height : props.suggestionRowHeight,
      duration: 100,
    }).start()
  }

  const startTracking = () => {
    isTrackingStarted = true
    openSuggestionsPanel()
    setState({
      isTrackingStarted: true,
    })
  }

  const stopTracking = () => {
    isTrackingStarted = false
    closeSuggestionsPanel()
    setState({
      isTrackingStarted: false,
    })
  }

  const resetTextbox = () => {
    const {textInputMinHeight} = props
    previousChar = ' '
    stopTracking()
    setState({textInputHeight: textInputMinHeight})
  }

  return (
    <View>
      <Animated.View style={[suggestionsPanelStyle, {height: suggestionRowHeight}]}>
        <FlatList
          keyboardShouldPersistTaps="always"
          horizontal={horizontal}
          ListEmptyComponent={loadingComponent}
          enableEmptySections
          data={suggestionsData}
          keyExtractor={keyExtractor}
          renderItem={rowData => {
            return renderSuggestionsRow(rowData, stopTracking)
          }}
        />
      </Animated.View>
      <TextInput
        {...props}
        onSelectionChange={event => {
          if (props.onSelectionChange) {
            props.onSelectionChange(event)
          }
          setState({selection: event.nativeEvent.selection})
        }}
        onContentSizeChange={event => {
          setState({
            textInputHeight:
              textInputMinHeight >= event.nativeEvent.contentSize.height
                ? textInputMinHeight
                : event.nativeEvent.contentSize.height + 10,
          })
        }}
        ref={component => {
          _textInput = component
        }}
        onChangeText={onChangeText}
        multiline={multiline}
        value={value}
        style={[textInputStyle, {height: Math.min(textInputMaxHeight, textInputHeight)}]}
        placeholder={placeholder ? placeholder : 'Write a comment...'}
      />
    </View>
  )
}

MentionsTextInput.propTypes = {
  textInputStyle: TextInput.propTypes.style,
  suggestionsPanelStyle: ViewPropTypes.style,
  loadingComponent: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  textInputMinHeight: PropTypes.number,
  textInputMaxHeight: PropTypes.number,
  trigger: PropTypes.string.isRequired,
  triggerLocation: PropTypes.oneOf(['new-word-only', 'anywhere']).isRequired,
  value: PropTypes.string,
  onChangeText: PropTypes.func.isRequired,
  triggerCallback: PropTypes.func.isRequired,
  renderSuggestionsRow: PropTypes.oneOfType([PropTypes.func, PropTypes.element]).isRequired,
  suggestionsData: PropTypes.array.isRequired,
  keyExtractor: PropTypes.func.isRequired,
  horizontal: PropTypes.bool,
  suggestionRowHeight: PropTypes.number.isRequired,
  MaxVisibleRowCount(props, propName, componentName) {
    if (!props.horizontal && !props.MaxVisibleRowCount) {
      return new Error("Prop 'MaxVisibleRowCount' is required if horizontal is set to false.")
    }
  },
  multiline: PropTypes.bool,
}

MentionsTextInput.defaultProps = {
  textInputStyle: {borderColor: '#ebebeb', borderWidth: 1, fontSize: 15},
  suggestionsPanelStyle: {backgroundColor: 'rgba(100,100,100,0.1)'},
  textInputMinHeight: 30,
  textInputMaxHeight: 80,
  horizontal: true,
  multiline: true,
}

export default MentionsTextInput;