var KeyPad = React.createClass({
  render: function() {
    var keys = [7,8,9,'+', 4,5,6, '-', 1,2,3, '/', 0, '.', '=', '*', 'Sq Root', 'Clear'];

    return (
      <div className="keys" onClick={this.props.onClick}>
        { keys.map(function(key) {
          if (key === 'Sq Root') {
            return <span className='operator'>&radic;</span>; 
          }
          return typeof key === 'number' || key === '.' ? <span>{key}</span> : <span className={key === 'Clear' ? 'clear' : 'operator'} >{key}</span>;
        }) }
      </div>
    ) 
  }
});

var OutputScreen = React.createClass({
  render: function() {
    return( <div className="screen">{this.props.result}</div> );
  }
});

var MainCal = React.createClass({
  getInitialState: function() {
    return { 
      result: 0,
      theme: 'light'
    };
  },

  calculateResult: function() {
    var newValue = this.state.result;

    // Parse and Calulate Sq Root
    if ( escape(this.state.result).indexOf('%') > -1 ) {
      var currentResult = this.state.result,
          extractNum = escape(currentResult).match(/%u221A\d+/)[0],
          sqRoot = Math.sqrt(extractNum.replace(/%u221A/, ''));
      
      newValue = escape(currentResult).replace(/%u221A\d+/, '*' + sqRoot);
    }

    try {
        this.setState({ result : parseInt(newValue[0]) ? eval(newValue) : eval('1'.concat(newValue)) }); 
      } catch(e) {
        // Default to 0 on error
        this.setState({ result : 0 });
      }
  },

  darkTheme: function() {
    return { backgroundColor: 'rgb(98, 96, 96)' };
  },

  lightTheme: function() {
    return { backgroundColor: '#ccc' }
  },

  clearResult: function() {
    this.setState({result: 0})
  },
  
  changeTheme: function() {
    this.state.theme === 'light' ? this.setState({theme : 'dark'}) : this.setState({theme : 'light'})
  },

  setResult: function(event) {
    // Clear
    if ( event.target.innerHTML === 'Clear') {
      return this.clearResult();
    }
    
    // Edge case
    if ( event.target.innerHTML.length > 1 ) return;

    // Calculate
    if ( event.target.innerHTML === '=') {
      return this.calculateResult();
    }

    var screen = this.state.result === 0 ? event.target.innerHTML : this.state.result.toString().concat(event.target.innerHTML);

    this.setState({ result: screen });
  },

  render: function() {
    return (
      <div className="calculator" style={this.state.theme === 'light' ? this.lightTheme() : this.darkTheme()}>
        <div className="top">
          <span className="theme clear" onClick={this.changeTheme}>{this.state.theme}</span>
          <OutputScreen result={this.state.result}/>
        </div>
        <KeyPad onClick={this.setResult} />
      </div>
    )
  }
});

React.render( <MainCal />, document.getElementById('cal-main') );  