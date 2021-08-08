import { loop } from "./game";
import { render } from "./renderer";

loop(0, delta => {}, () => render());

