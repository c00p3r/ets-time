import React from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';

// Components
import Track from './Track';
import Filters from './Filters';
import ChangeTrack from './ChangeTrack';
import TracksStatistic from './TracksStatistic';

// Actions
import {
  getTracks,
  toggleTrackFilters,
  clearTrackFilters,
  toggleChangeTrack,
  setVars
} from './../../store/actions/trackActions';
import { clearErrors } from './../../store/actions/generalActions';

// Helpers
import { showClearFilters, formatDateToServer } from './../../shared/HelpService';

// Icons
import {
  FaPlus,
  FaFilter,
  FaClose,
  FaBug,
  FaCogs,
  FaPaintBrush,
  FaBook,
  FaGroup,
  FaGraduationCap,
  FaCheckCircle,
  FaBullhorn,
  FaSuitcase,
  FaHeartbeat,
  FaCalendarTimesO,
  FaQuestionCircle
} from 'react-icons/lib/fa';

const default_icon = <FaQuestionCircle />;

const TypeWorkIcon = type_work => {
  const tw = {
    Development: (
      <span title="Development">
        <FaCogs />
      </span>
    ),
    Design: (
      <span title="Design">
        <FaPaintBrush />
      </span>
    ),
    'Bug fixing': (
      <span title="Bug fixing">
        <FaBug style={{ color: '#FF6E40' }} />
      </span>
    ),
    Documentation: (
      <span title="Documentation">
        <FaBook />
      </span>
    ),
    Mentoring: (
      <span title="Mentoring">
        <FaGroup />
      </span>
    ),
    Study: (
      <span title="Study">
        <FaGraduationCap />
      </span>
    ),
    Testing: (
      <span title="Testing">
        <FaCheckCircle />
      </span>
    ),
    Meeting: (
      <span title="Meeting">
        <FaBullhorn />
      </span>
    ),
    Vacation: (
      <span title="Vacation">
        <FaSuitcase />
      </span>
    ),
    SickDay: (
      <span title="Sick Day">
        <FaHeartbeat />
      </span>
    ),
    DayOff: (
      <span title="Day Off">
        <FaCalendarTimesO />
      </span>
    )
  };

  return tw[type_work] || default_icon;
};

class Tracks extends React.Component {
  state = { showFilters: false };

  componentDidMount() {
    let { token, filters } = this.props;
    this.props.getTracks(token, filters);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ showFilters: showClearFilters(nextProps.filters) });

    if (!isEqual(nextProps.filters, this.props.filters)) {
      this.props.getTracks(nextProps.token, nextProps.filters);
    }

    if (nextProps._need_upd_list) {
      this.props.setVars({ _need_upd_list: false });
      this.props.getTracks(nextProps.token, nextProps.filters);
    }
  }

  openFilters = () => {
    this.props.toggleTrackFilters();
  };

  clearFilters = () => {
    this.props.clearTrackFilters();
  };

  openChangeTrack = () => {
    this.props.toggleChangeTrack(true);
    this.props.clearErrors();
  };

  render() {
    const { showFilters } = this.state;
    const { bgColor, token, tracks, view, activeUser, showStatistic, divideDays } = this.props;
    let startOfDayRange = '', dateOfGroup = '';

    const trackComponents = tracks.map((t, i) => {
      let isStartDay = false;
      if (divideDays) {
        if (startOfDayRange !== t.date_task) {
          startOfDayRange = t.date_task;
          isStartDay = true;
          dateOfGroup = formatDateToServer(t.date_task);
        } else {
          isStartDay = false;
        }
      }

      return (
        <Track
          token={token}
          trackData={t}
          key={i}
          view={view}
          bgColor={bgColor}
          TypeWorkIcon={TypeWorkIcon}
          isStartDay={isStartDay}
          dateOfGroup={dateOfGroup}
        />
      );
    });

    return (
      <div className="container" style={{ background: bgColor }}>
        {showStatistic ? <TracksStatistic tracks={tracks} view={view} activeUser={activeUser} /> : null}
        {trackComponents}
        <Filters activeUser={activeUser} />
        <ChangeTrack />
        <div className="mainBtns">
          <button className="mainBtns__btn" onClick={this.openChangeTrack} style={{ color: bgColor }}>
            <FaPlus />
          </button>
          <button className="mainBtns__btn" onClick={this.openFilters} style={{ color: bgColor }}>
            <FaFilter />
          </button>
          {showFilters
            ? <button className="mainBtns__btn" onClick={this.clearFilters} style={{ color: bgColor }}>
                <FaClose />
              </button>
            : null}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  let { tracks, filters, view, _need_upd_list } = state.trackReducer;
  let { bgColor, token, showStatistic, divideDays } = state.generalReducer;
  let { activeUser } = state.userReducer;

  return {
    _need_upd_list,
    tracks,
    filters,
    view,
    bgColor,
    token,
    activeUser,
    showStatistic,
    divideDays
  };
}

export default connect(mapStateToProps, {
  getTracks,
  toggleTrackFilters,
  clearTrackFilters,
  toggleChangeTrack,
  clearErrors,
  setVars
})(Tracks);
