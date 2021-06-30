import * as React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"


class IndexPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blocks: new Array(8).fill(0).map(() => new Array(31).fill(0)),
      levelCodeInput: ''
    }
  }
  renderBlockButtons() {
    const buttons = []
    const { blocks } = this.state

    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 31; j++) {
        buttons.push(<BlockButton blockUpdate={this.handleBlockButtonUpdate.bind(this)} on={blocks[i][j]} x={i} y={j} />)
      }
      buttons.push(<br />)
    }

    return buttons
  }

  handleBlockButtonUpdate(e, attrs) {
    let { x, y, on } = attrs
    let { blocks } = this.state

    if (e.button == 0) {
      on++

      if (on >= 6) {
        on = 0;
      }

    } else {
      on = 0;
    }

    blocks[x][y] = on
    this.setState({ blocks })
  }

  clearBlocks() {
    this.setState({blocks: new Array(8).fill(0).map(() => new Array(31).fill(0)), levelCodeInput: ''})
  }

  findBlock(x, y) {
    const { blocks } = this.state

    blocks.find((block) => (block.x === x && block.y === y))
  }

  generateLevelCode() {
    const { blocks } = this.state
    let output = ''

    for (var i = 0; i < 8; i++) {
      for (var j = 0; j < 31; j++) {
        var block = blocks[i][j]

        if (block > 0) {
          output += `Brick ${j} ${i} ${block}\n`
        }
      }
    }

    return output
  }
  updateTextArea(e) {
    this.setState({levelCodeInput: e.target.value})
  }

  parseLevelCode() {
    const {levelCodeInput} = this.state
    let {blocks} = this.state

    var lines = levelCodeInput.split('\n')
    console.log(lines)
    lines.forEach((line) => {
      try {
        const values = line.split(' ')
        const x = values[1]
        const y = values[2]
        const on = values[3]
  
        blocks[y][x] = on
      } catch {
        alert('invalid level code. please check the input')
      }
    })

    this.setState({blocks})
  }


  render() {
    const {levelCodeInput} = this.state

    return (
      <Layout>
        <Seo title="Home" />
        <button onClick={() => this.clearBlocks()}>clear</button><br />
        {this.renderBlockButtons()}

        <pre>{this.generateLevelCode()}</pre>
        <textarea value={levelCodeInput} onChange={(e) => this.updateTextArea(e)}></textarea>
        <button onClick={this.parseLevelCode.bind(this)}>parse level code</button>
      </Layout>
    )
  }
}

class BlockButton extends React.Component {
  colorMap = {
    0: 'grey',
    1: 'red',
    2: 'orange',
    3: 'yellow',
    4: 'green',
    5: 'blue'
  }

  render() {
    const { blockUpdate, x, y, on } = this.props
    const backgroundColor = this.colorMap[on]
    return (
      <button style={{ backgroundColor, borderWidth: 1, borderColor: 'lightgrey', height: 72, width: 36 }} onMouseDownCapture={(e) => blockUpdate(e, { x, y, on })}></button>
    )
  }
}

export default IndexPage


window.addEventListener('contextmenu', function (e) { 
  // do something here... 
  e.preventDefault(); 
}, false);