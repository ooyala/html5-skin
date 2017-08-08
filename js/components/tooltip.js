var React = require('react');
var deepmerge = require('deepmerge');

function getContainerStyle(bottom, visible, responsivenessMultiplier, alignment) {
    var verticalAlignment = 80 * responsivenessMultiplier;
    var alignmentStyle = {
        left: {
            left: 0,
            transform: 'translate(0,' + verticalAlignment + '%)'
        },
        center: {
            left: '50%',
            transform: 'translate(-50%,' + verticalAlignment + '%)'
        },
        right: {
            right: 0,
            transform: 'translate(0,' + verticalAlignment + '%)'
        }
    };

    var style = {
        position: 'absolute',
        color: 'white',
        fontFamily: '"Roboto Condensed", sans-serif',
        opacity: visible ? '0.75' : '0',
        fontWeight: 'normal',
        bottom: bottom,
        //display: visible ? 'block' : 'none',
        transition:'1s',
        visibility: visible ? 'visible' : 'hidden',
    }

    return deepmerge(alignmentStyle[alignment], style);

}

function getBoxStyle(responsivenessMultiplier) {
    return {
        borderRadius: '3px',
        fontSize: '15px',
        textShadow: 'none',
        background: 'black',
        paddingTop: 8 * responsivenessMultiplier,
        paddingRight: 20 * responsivenessMultiplier,
        paddingBottom: 8 * responsivenessMultiplier,
        paddingLeft: 20 * responsivenessMultiplier
    }
}

var pointerAlignment = {
    left: '10%',
    center: '45%',
    right: '85%'
}
function getPointerStyle(alignment) {
    return {
        position: 'absolute',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '5px solid black',
        left: pointerAlignment[alignment]
    };
}


var Tooltip = React.createClass({
    render: function () {
        if (this.props.enabled) {
            return (
                <div style={{ position: 'relative' }}>
                    <div className='oo-tooltip' style={getContainerStyle(this.props.bottom, this.state.visible, this.props.responsivenessMultiplier, this.props.alignment)}>
                        <div style={getBoxStyle(this.props.responsivenessMultiplier)}>
                            {this.props.text}
                        </div>
                        <div style={getPointerStyle(this.props.alignment)}></div>
                    </div>
                    <div onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
                        {this.props.children}
                    </div>
                </div>
            );
        } else {
            return (<div>{this.props.children }</div>);
        }
    },

    getInitialState: function () {
        return { visible: false }
    },

    onMouseOver: function () {
        this.setState({ visible: true });
    },

    onMouseLeave: function () {
        this.setState({ visible: false });
    }
});

Tooltip.propTypes = {
    enabled: React.PropTypes.bool.isRequired,
    text: React.PropTypes.string.isRequired,
    alignment: React.PropTypes.oneOf(['left', 'center', 'right']),
    responsivenessMultiplier: React.PropTypes.number.isRequired,
    bottom: React.PropTypes.number.isRequired,
};

Tooltip.defaultProps = {
    enabled: false,
    alignment: 'center',
    responsivenessMultiplier: 1
};

module.exports = Tooltip;