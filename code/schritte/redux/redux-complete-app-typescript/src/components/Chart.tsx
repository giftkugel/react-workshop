import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as d3 from 'd3';
import * as nv from 'nvd3';

import {GreetingChartData } from '../types';

import {connect} from 'react-redux';

import * as actions from '../actions';
import { aggregateGreetings } from '../selectors';

type ChartProps = {
	data: GreetingChartData,
	onSegmentSelected: (segment: string) => any
};


class Chart extends React.Component<ChartProps, {}> {

	_d3selection: any; // ??? d3.Selection<any,any,any,any>;
	_nvd3chart: nv.PieChart;
	_chart: SVGElement;

    shouldComponentUpdate() {
        return false;
    }

    // will be called even when shouldComponentUpdate returns false
    componentWillReceiveProps(nextProps: ChartProps) {
        const {data} = nextProps;
        this._d3selection
            .datum(data)
            .call(this._nvd3chart);
    }

    componentDidMount() {
        const {data, onSegmentSelected} = this.props;

        // http://nvd3.org/examples/pie.html
        nv.addGraph(() => {
            const chart = nv.models.pieChart()
                .x(function (d) {
                    return d.label
                })
                .y(function (d) {
                    return d.value
                })
                .showLabels(true);
            chart.legend.updateState(false);

            this._d3selection = d3.select(this._chart);
            this._d3selection
                .datum(data)
                .call(chart);

            this._nvd3chart = chart;
            if (onSegmentSelected) {
                chart.pie.dispatch.on("elementClick", e => onSegmentSelected(e.data.label));
            }
            return chart;
        });
    }

    render() {
        const svgStyle = {
            height: '500px',
            width: '600px'
        };
        return <svg style={svgStyle} className="with-3d-shadow with-transitions" ref={c => this._chart = c}></svg>
    }
}


export default connect(
    state => ({
        data: aggregateGreetings(state.greetings),
    }),
    dispatch => ({
        onSegmentSelected: (filter: string) => dispatch(actions.setFilter(filter))
    })
)(Chart);
