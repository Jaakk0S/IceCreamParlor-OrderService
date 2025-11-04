// @ts-check

import logger from "pino";
import * as dayjs from 'dayjs'

const log = logger({
    timestamp: () => `,"time":"${dayjs().format()}"`
});

export default log;