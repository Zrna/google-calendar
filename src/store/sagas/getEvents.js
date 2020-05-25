import { put, takeLatest } from 'redux-saga/effects';
import {
  GET_EVENTS_REQUEST,
  GET_EVENTS_SUCCESS,
  GET_EVENTS_ERROR
} from '../actions/types';

import { gapi } from '../../config';

function* getEvents(action) {
  const { numberOfDays } = action;

  const todayAtMidnight = new Date(new Date().setHours(0,0,0,0)).toISOString();
  let timeMax = new Date(new Date().setHours(0,0,0,0));
  timeMax.setDate(timeMax.getDate() + numberOfDays);

  try {
    const response = yield gapi.client.calendar.events.list({
      'calendarId': 'primary',
      'timeMin': todayAtMidnight,
      'timeMax': timeMax.toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'orderBy': 'starttime'
    });

    const events = response.result.items;
    const payload = {
      events,
      numberOfDays
    };

    yield put({ type: GET_EVENTS_SUCCESS, payload });
  } catch (e) {
    console.log('get events saga error', e);
    const error = e.result.error.message;
    yield put({ type: GET_EVENTS_ERROR, error });
  }
};

export function* onGetEvents() {
  yield takeLatest(GET_EVENTS_REQUEST, getEvents)
};