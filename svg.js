// core
import React, { PureComponent } from 'react'
import { View, Image } from 'react-native'
import PropTypes from 'prop-types'
// libs
import Svg, { Rect, Path ,G} from 'react-native-svg'
import genMatrix from './genMatrix'

/**
 * A simple component for displaying QR Code using svg
 */
export default class QRCode extends PureComponent {
  static propTypes = {
    /* what the qr code stands for */
    value: PropTypes.string,
    /* the whole component size */
    size: PropTypes.number,
    /* the color of the cell */
    color: PropTypes.string,
    /* the color of the background */
    backgroundColor: PropTypes.string,
    /* an image source object. example {uri: 'base64string'} or {require('pathToImage')} */
    logo: Image.propTypes.source,
    /* logo width in pixels */
    logoSize: PropTypes.number,
    /* the logo gets a filled rectangular background with this color. Use 'transparent'
         if your logo already has its own backdrop. Default = same as backgroundColor */
    logoBackgroundColor: PropTypes.string,
    /* logo's distance to its wrapper */
    logoMargin: PropTypes.number,
    /* the border-radius of logo image */
    logoBorderRadius: PropTypes.number,
    /* get svg ref for further usage */
    getRef: PropTypes.func,
    /* error correction level */
    ecl: PropTypes.oneOf(['L', 'M', 'Q', 'H'])
  };
  static defaultProps = {
    value: 'This is a QR Code.',
    size: 100,
    color: 'black',
    backgroundColor: 'white',
    logoMargin: 2,
    ecl: 'H'
  };
  constructor (props) {
    super(props)
    this._matrix = null
    this._cellSize = null
    this._path = null
    this.setMatrix(props)
  }
  componentWillUpdate (nextProps) {
    // if value has changed, re-setMatrix
    if (nextProps.value !== this.props.value) {
      this.setMatrix(nextProps)
    }
  }
  /* calculate the size of the cell and draw the path */
  setMatrix (props) {
    const { value, size, ecl } = props
    this._matrix = genMatrix(value, ecl)
    this._cellSize = size / (this._matrix.length + 2)
    this._path = this.transformMatrixIntoPath()
  }
  /* project the matrix into path draw */
  transformMatrixIntoPath () {
    const matrix = this._matrix
    const cellSize = this._cellSize
    // adjust origin
    const oY = cellSize * 1.5
    const oX = cellSize
    let d = ''
    matrix.forEach((row, i) => {
      let needDraw = false
      row.forEach((column, j) => {
        if (column) {
          if (!needDraw) {
            d += `M${oX + cellSize * j} ${oY + cellSize * i} `
            needDraw = true
          }
          if (needDraw && j === matrix.length - 1) {
            d += `L${oX + cellSize * (j + 1)} ${oY + cellSize * i} `
          }
        } else {
          if (needDraw) {
            d += `L${oX + cellSize * j} ${oY + cellSize * i} `
            needDraw = false
          }
        }
      })
    })
    return d
  }
  renderLogo () {
    const { size, backgroundColor, logo, logoBackgroundColor = backgroundColor,
      logoSize = size * 0.2, logoMargin, logoBorderRadius } = this.props
    const wrapSize = logoSize + logoMargin * 2
    const position = size / 2 - logoSize / 2 - logoMargin

    const viewStyle = {
      backgroundColor: logoBackgroundColor,
      width: wrapSize,
      height: wrapSize,
      position: 'absolute',
      left: position,
      top: position,
      padding: logoMargin,
      borderRadius: logoBorderRadius,
      overflow: 'hidden'
    }

    const imageStyle = {
      width: logoSize,
      height: logoSize
    }

    return (
      <View style={viewStyle}>
        <Image
          style={imageStyle}
          source={logo}
          resizeMode='contain'
        />
      </View>
    )
  }

  render () {
    const { size, color, backgroundColor, logo, getRef } = this.props

    return (
      <View>
        <Svg ref={getRef} width={size+30} height={size+30}>
          <Rect
            x={this._cellSize}
            y={this._cellSize}
            width={size +30 } 
            height={size +30}
            fill={backgroundColor}
          />
          <G 
            translate={15,15}
            >
          <Path
            d={this._path}
            stroke={color}
            strokeWidth={this._cellSize}
            
          />
          </G>
        </Svg>
        {logo && this.renderLogo()}
      </View>
    )
  }
}
