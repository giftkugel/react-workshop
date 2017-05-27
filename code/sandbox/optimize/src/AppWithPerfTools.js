import React from 'react';
import ReactPerfTool from 'react-perf-tool';
import Perf from 'react-addons-perf';
import 'react-perf-tool/lib/styles.css';
import App from './App';

const AppWithPerfTools = ({boxes}) => (
    <div>
        <App boxes={boxes} />
        <ReactPerfTool perf={Perf} />
    </div>
);

export default AppWithPerfTools;