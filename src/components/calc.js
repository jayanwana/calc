import React from 'react';


class Calc extends React.Component {
constructor(props) {
  super (props);
  this.state = {
    calculation: "",
    result: "",
    clear: false,
    history: [],
    step: 0,
    shifty: false,
    rad: false,
    };
  }

  enterNumber(number) {
    if (this.state.clear) {
      this.setState({
        calculation: number,
        clear: false
      })
    } else {
      this.setState({
        calculation: `${this.state.calculation}${number}`
      })
    }
  }

  ans() {
    if (this.state.result !== "SyntaxError" && this.state.result !== "TypeError") {
      if(this.state.clear) {
    this.setState({
      calculation: this.state.result,
      clear: false
    })} else {
        this.setState({ calculation: `${this.state.calculation}${this.state.result}`})
      }
  }}
  equalsTo(y) {
    const Sqrt = Math.sqrt;
    const toRad = Math.PI/180;
    const toDeg = 180/Math.PI;
    const e = Math.E
    let rad = this.state.rad
    function sin(x) { return Math.sin(x * (rad ? 1 : toRad))};
    function cos(x) { return Math.cos(x * (rad ? 1 : toRad))};
    function tan(x) { if ((x/90)%2===1 && !rad ){ return Infinity } else if ((x/90)%2===0 && !rad){ return 0 }return Math.tan(x * (rad ? 1 : toRad))};
    function log(x) { return Math.log10(x)};
    function ln(x) { return Math.log(x)};
    function asin(x) { return Math.asin(x) * (rad ? 1 : toDeg)};
    function acos(x) { return Math.acos(x) * (rad ? 1 : toDeg)};
    function atan(x) { return Math.atan(x) * (rad ? 1 : toDeg)};
    function efunc(x=1) { return x * Math.E};
    function factorial(x) { return (x != 1) ? x * factorial(x - 1) : 1};
    function percent(x) { return x/100 };
    if (y) {
      try {
        let evaluation = y;
        evaluation = evaluation.replace(/[√π^]/g, function (m) {
            return {
                '√': 'Sqrt',
                "π": `(${Math.PI})`,
                "^": '**'
            }[m];
          });
        evaluation = evaluation.replace(/(\d+)\(/g, (m, n) => `${n}*(`)
        evaluation = evaluation.replace(/(\d+)!/g, (m, n) => factorial(+n))
        evaluation = evaluation.replace(/(\d+)%/g, (m, n) => percent(+n))
        if (evaluation.toString().indexOf('e') !==0) {
          evaluation = evaluation.replace(/(\d+)e/g, (m, n) => efunc(+n))
            }
        let result = eval(evaluation);
        let test = result - Math.floor(result)
        if (test.toString().length > 9) {
          result = result.toFixed(9)
          result = Number(result)
        }
        console.log(result);
        this.setState({
          result,
          clear: true,
          history: [...this.state.history, y],
          step: 0
        })
      } catch (e) {
        console.log(e);
        this.setState(
          {
            result: e.name,
          }
        )
      }}}

  scrollUp() {
    if (this.state.history.length > 1 && this.state.history.length > this.state.step) {

    this.setState({
      step: this.state.step + 1,
      calculation: this.state.history[this.state.history.length-(this.state.step+1)],
      clear: false,
    })}
  }

  scrollDown() {
    if (this.state.history.length > 1 && this.state.step > 1) {

    this.setState({
      step: this.state.step - 1,
      calculation: this.state.history[this.state.history.length-(this.state.step-1)],
    })}
  }

  backspace() {
    this.setState(
      { calculation: this.state.calculation.substring(0, this.state.calculation.length - 1), clear: false }
    )

  }

  clear() {
    this.setState({
      calculation: "",
      result: "",
      step: 0
    })
  }

  convertFraction(x) {
    if (typeof x === 'number') {
      if (Math.round(x) !== x) {
        x = Math.abs(x)
        let d = x.toString().indexOf('.');
        let l = x.toString().length;
        if ( (l-d) < 5 ) {
          let p = 10**((l-1)-d);
          let xf = x * p;
          let p2 = p
          while(p2){
            let t = p2;
            p2 = xf % p2;
            xf = t;
        }
        let num = (x*p)/xf;
        let denom = p/xf;
        this.setState(
          { result: `${num}/${denom}` }
        )
      } else {
        let n = x - Math.floor(x)
        if ( n.toString().substring(0, 6) === "0.6666" ) {
          this.setState({result: '2/3'})
        } else if (n.toString().substring(0, 6) === "0.3333") {
          this.setState({result: '1/3'})
        }
      }
    }} else if ( x.includes('/')) {
      this.equalsTo(x)
    }
  }

  shift() {
    this.setState({ shifty : !this.state.shifty })
  }

  toRad() {
    this.setState({ rad : !this.state.rad })
  }

  render() {
    let Ans = this.state.result
  return(
    <div className='calc-wrapper'>
      <h1>Calculator</h1>
      <Display calculation={this.state.calculation} value={ this.state.result } />
      <div className="control">
        <button className="shift" onClick={() => this.shift()}>Shift</button>
        <button onClick={() => this.scrollUp()}> &#8593;</button>
        <button onClick={() => this.scrollDown()}>&#8595;</button>
        <button onClick={() => this.backspace()}>DEL</button>
        <button onClick={() => this.clear()}>C</button>
      </div>
      <div className='comp-func'>
        {this.state.shifty ?
          <button className="shift" onClick={() => this.enterNumber('asin(')}>Sin<sup>-1</sup></button> :
          <button onClick={() => this.enterNumber('sin(')}>Sin</button>}
        {this.state.shifty ?
          <button className="shift" onClick={() => this.enterNumber('acos(')}>Cos<sup>-1</sup></button> :
          <button onClick={() => this.enterNumber('cos(')}>Cos</button>}
        {this.state.shifty ?
          <button className="shift" onClick={() => this.enterNumber('atan(')}>Tan<sup>-1</sup></button> :
          <button onClick={() => this.enterNumber('tan(')}>Tan</button>}
        {this.state.shifty ?
          <button className="shift" onClick={() => this.enterNumber('')} disabled={true}>Log<sub>2</sub></button> :
          <button onClick={() => this.enterNumber('log(')}>Log</button>}
        {this.state.shifty ?
          <button className="shift" onClick={() => this.enterNumber('e')}>e</button> :
          <button onClick={() => this.enterNumber('ln(')}>ln</button>}
        <button onClick={() => this.enterNumber(this.state.clear ? `${Ans}^(-1)` : '^(-1)')}>x<sup>-1</sup></button>
        <button onClick={() => this.enterNumber(this.state.clear ? `${Ans}^2` : '^2')}>x<sup>2</sup></button>
        <button onClick={() => this.enterNumber('*10^')}>x10<sup>x</sup></button>
        <button onClick={() => this.enterNumber(this.state.clear ? `${Ans}^(` : '^(')}>x<sup>x</sup></button>
        <button onClick={() => this.enterNumber('√(')}>√</button>
        {this.state.shifty ?
          <button className="shift" onClick={() => this.enterNumber('!')}>!</button> :
          <button onClick={() => this.enterNumber('%')}>%</button>}
        <button onClick={() => this.convertFraction(this.state.result)}>S=D</button>
        <button onClick={() => this.enterNumber('π')}>&pi;</button>
        <button onClick={() => this.toRad()}><span style={this.state.rad ? {} : {color: '#bb4430'}}>D</span>-<span style={this.state.rad ? {color: '#bb4430'} : {}}>R</span></button>
        <button className='eval-button-2' onClick={() => this.ans()}>Ans</button>
      </div>
      <div className='simple-func'>
        <button onClick={() => this.enterNumber(this.state.clear ? `${Ans}+` : '+')}>+</button>
        <button onClick={() => this.enterNumber(this.state.clear ? `${Ans}-` : '-')}>-</button>
        <button onClick={() => this.enterNumber(this.state.clear ? `${Ans}*` : '*')}>X</button>
        <button onClick={() => this.enterNumber(this.state.clear ? `${Ans}/` : '/')}>/</button>
        <button onClick={() => this.enterNumber('(')}>(</button>
        <button onClick={() => this.enterNumber(')')}>)</button>
      </div>
      <div className='numbers'>
        <button onClick={() => this.enterNumber(1)}>1</button>
        <button onClick={() => this.enterNumber(2)}>2</button>
        <button onClick={() => this.enterNumber(3)}>3</button>
        <button onClick={() => this.enterNumber(4)}>4</button>
        <button onClick={() => this.enterNumber(5)}>5</button>
        <button onClick={() => this.enterNumber(6)}>6</button>
        <button onClick={() => this.enterNumber(7)}>7</button>
        <button onClick={() => this.enterNumber(8)}>8</button>
        <button onClick={() => this.enterNumber(9)}>9</button>
        <button onClick={() => this.enterNumber('.')}>.</button>
        <button onClick={() => this.enterNumber(0)}>0</button>
        <button className='eval-button' onClick={() => this.equalsTo(this.state.calculation)}>=</button>
      </div>
      <div className='eval'>



      </div>

    </div>
        )}
      }

function Display(props) {
  return (
    <div className="input-group">
      <input className="input-group calc" type="text" value={props.calculation} disabled={true}/>
      <input className="input-group result" type="text" disabled={true} value={props.value}/>
    </div>
  )
}



export default Calc;
