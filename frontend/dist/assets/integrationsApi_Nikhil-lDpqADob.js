import{c as t,w as a}from"./index-kJHAGtmA.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=t("CalendarPlus",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["path",{d:"M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8",key:"3spt84"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M16 19h6",key:"xwg31i"}],["path",{d:"M19 16v6",key:"tddt3s"}]]),r={getGoogleCalendarStatus:async()=>(await a.get("/integrations/google-calendar/status")).data,getGoogleCalendarAuthUrl:async()=>(await a.get("/integrations/google-calendar/connect")).data,disconnectGoogleCalendar:async()=>(await a.post("/integrations/google-calendar/disconnect")).data,pushEventToGoogleCalendar:async e=>(await a.post(`/integrations/google-calendar/events/${e}`)).data};export{o as C,r as i};
