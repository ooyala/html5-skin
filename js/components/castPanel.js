const React = require('react');
const PropTypes = require('prop-types');
const ClassNames = require('classnames');

class CastPanel extends React.Component {

    shouldComponentUpdate(nextProps) {
        if (nextProps.connected !== this.props.connected) {
            return true;
        }
        return false;
    }

    render() {
        const castPanelClass = ClassNames({
            'oo-info-panel-cast': true,
            'oo-inactive': !this.props.connected
          },
          this.props.className);
        
        return (
            <div className={castPanelClass}>
                <p>Connected to <span>{this.props.device}</span></p>
            </div>
        )
    }
}

CastPanel.propTypes = {
    device: PropTypes.string,
    connected: PropTypes.bool
}

CastPanel.defaultProps = {
    device: "",
    connected: false
}

module.exports = CastPanel;