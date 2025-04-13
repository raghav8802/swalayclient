/* eslint-disable */
import PropTypes from "prop-types";
import { 
  ChartContainer,
  ChartTooltipContent,
  ChartLegendContent
} from "./chart";

// These PropTypes definitions are separated from the main component file
// to avoid TypeScript and ESLint compatibility issues

ChartContainer.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  config: PropTypes.object.isRequired
};

ChartTooltipContent.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  className: PropTypes.string,
  indicator: PropTypes.oneOf(["line", "dot", "dashed"]),
  hideLabel: PropTypes.bool,
  hideIndicator: PropTypes.bool,
  label: PropTypes.any,
  labelFormatter: PropTypes.func,
  labelClassName: PropTypes.string,
  formatter: PropTypes.func,
  color: PropTypes.string,
  nameKey: PropTypes.string,
  labelKey: PropTypes.string
};

ChartLegendContent.propTypes = {
  className: PropTypes.string,
  hideIcon: PropTypes.bool,
  payload: PropTypes.array,
  verticalAlign: PropTypes.oneOf(["top", "middle", "bottom"]),
  nameKey: PropTypes.string
}; 