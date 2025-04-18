import { BackendController } from "./controllers/backend_controller";
import { BackendRunner } from "./entities/entities";
import { PoxiSystemRunner } from "./poxi_runner";
import { memoize } from "../utiles/memoize";

function _get_backend_runner(): BackendRunner {
    return new BackendController(new PoxiSystemRunner());
}

const get_backend_runner = memoize(_get_backend_runner);

export { get_backend_runner };
