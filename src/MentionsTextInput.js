import React, {Component} from 'react';
import {Text, View, Animated, TextInput, FlatList, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';

export default class MentionsTextInput extends Component {
  constructor() {
    super();
    this.state = {
      textInputHeight: '',
      isTrackingStarted: false,
      suggestionRowHeight: new Animated.Value(0),
      selection: {start: 0, end: 0},
    };
    this.isTrackingStarted = false;
    this.previousChar = ' ';
  }

  componentWillMount() {
    this.setState({
      textInputHeight: this.props.textInputMinHeight,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value && !nextProps.value) {
      this.resetTextbox();
    } else if (this.isTrackingStarted && !nextProps.horizontal && nextProps.suggestionsData.length !== 0) {
      const numOfRows =
        nextProps.MaxVisibleRowCount >= nextProps.suggestionsData.length
          ? nextProps.suggestionsData.length
          : nextProps.MaxVisibleRowCount;
      const height = numOfRows * nextProps.suggestionRowHeight;
      this.openSuggestionsPanel(height);
    } else if (nextProps.suggestionsData.length === 0) {
      this.openSuggestionsPanel(0);
    }
  }

  onChangeText(val) {
    const {onChangeText, triggerLocation, trigger} = this.props;
    const {isTrackingStarted} = this.state;

    onChangeText(val); // pass changed text back
    const lastChar = val.substr(this.state.selection.end, 1);
    const wordBoundry = triggerLocation === 'new-word-only' ? this.previousChar.trim().length === 0 : true;
    if (lastChar === trigger && wordBoundry) {
      this.startTracking();
    } else if ((lastChar === ' ' && isTrackingStarted) || val === '') {
      this.stopTracking();
    }
    this.previousChar = lastChar;
    this.identifyKeyword(val);
  }

  closeSuggestionsPanel() {
    Animated.timing(this.state.suggestionRowHeight, {
      toValue: 0,
      duration: 100,
    }).start();
  }

  updateSuggestions(lastKeyword) {
    this.props.triggerCallback(lastKeyword);
  }

  identifyKeyword(val) {
    const {triggerLocation, trigger} = this.props;
    if (this.isTrackingStarted) {
      const boundary = triggerLocation === 'new-word-only' ? 'B' : '';
      const pattern = new RegExp(`\\${boundary}${trigger}[a-z0-9_-]+|\\${boundary}${trigger}`, 'gi');
      const keywordArray = val.substr(0, this.state.selection.end + 1).match(pattern);
      if (keywordArray && !!keywordArray.length) {
        const lastKeyword = keywordArray[keywordArray.length - 1];
        this.updateSuggestions(lastKeyword);
      }
    }
  }

  openSuggestionsPanel(height) {
    Animated.timing(this.state.suggestionRowHeight, {
      toValue: height != null ? height : this.props.suggestionRowHeight,
      duration: 100,
    }).start();
  }

  startTracking() {
    this.isTrackingStarted = true;
    this.openSuggestionsPanel();
    this.setState({
      isTrackingStarted: true,
    });
  }

  stopTracking() {
    this.isTrackingStarted = false;
    this.closeSuggestionsPanel();
    this.setState({
      isTrackingStarted: false,
    });
  }

  resetTextbox() {
    const {textInputMinHeight} = this.props;
    this.previousChar = ' ';
    this.stopTracking();
    this.setState({textInputHeight: textInputMinHeight});
  }

  render() {
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
    } = this.props;

    const {suggestionRowHeight, textInputHeight} = this.state;

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
              return renderSuggestionsRow(rowData, this.stopTracking.bind(this));
            }}
          />
        </Animated.View>
        <TextInput
          {...this.props}
          onSelectionChange={event => {
            if (this.props.onSelectionChange) {
              this.props.onSelectionChange(event);
            }
            this.setState({selection: event.nativeEvent.selection});
          }}
          onContentSizeChange={event => {
            this.setState({
              textInputHeight:
                textInputMinHeight >= event.nativeEvent.contentSize.height
                  ? textInputMinHeight
                  : event.nativeEvent.contentSize.height + 10,
            });
          }}
          ref={component => {
            this._textInput = component;
          }}
          onChangeText={this.onChangeText.bind(this)}
          multiline={multiline}
          value={value}
          style={[textInputStyle, {height: Math.min(textInputMaxHeight, textInputHeight)}]}
          placeholder={placeholder ? placeholder : 'Write a comment...'}
        />
      </View>
    );
  }
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
      return new Error("Prop 'MaxVisibleRowCount' is required if horizontal is set to false.");
    }
  },
  multiline: PropTypes.bool,
};

MentionsTextInput.defaultProps = {
  textInputStyle: {borderColor: '#ebebeb', borderWidth: 1, fontSize: 15},
  suggestionsPanelStyle: {backgroundColor: 'rgba(100,100,100,0.1)'},
  loadingComponent: () => <Text>Loading...</Text>,
  textInputMinHeight: 30,
  textInputMaxHeight: 80,
  horizontal: true,
  multiline: true,
};