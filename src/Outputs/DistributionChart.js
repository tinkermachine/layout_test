import React from 'react';
import {makeStyles} from '@material-ui/core/styles'
import {
    AreaChart,
    BarChart,
    Bar,
    Area,
    XAxis,
    YAxis,
    LabelList,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Label,
    Legend, ReferenceDot
} from 'recharts'
import Paper from '@material-ui/core/Paper'
import {Card} from "@material-ui/core";
import {LabelSelector} from "./LabelSelector";
import CardSettings from "./CardSettings";
import {convert_format} from "../utils/utils"

const chartColors = [
    '#004666',
    '#A5014B',
    '#247308',
    '#41C0EB',
    '#EC7404',
    '#00044E'
]

export default function Distribution(props) {


    //Styles
    const useStyles = makeStyles(theme => ({
        saCard: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
        },
        paper: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: '1%',
            padding: '1%',
            background: 'linear-gradient(#FFFFFF 60%,#F4F4F4)'
        },
        cardHeaderContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            // backgroundColor:'orange',
            // marginBottom:0
        },
        cardTitleHeader: {
            color: '#4F545A',
            fontFamily: 'Questrial',
            fontWeight: '20',
            fontSize: '2em',
            marginTop: '3px',
            marginLeft: '7px',
            marginBottom: '10px',
            // backgroundColor:'blue'
        },
        chartTitle: {
            fontFamily: 'Questrial',
            // background: '#7C97B7',
            fontSize: '1.2em',
            fontWeight: '300',
            color: '#3C4148',
            marginBottom: '0'
        },
        chartNote: {
            fontFamily: 'Questrial',
            fontSize: '0.9em',
            fontWeight: '300',
            color: '#3C4148',
            marginTop: '0'
        },
        xlabel: {
            fontFamily: 'Questrial',
            fontSize: '1.0em',
            fontWeight: '100',
            fill: '#4F545A'
        },
        ylabel: {
            fontFamily: 'Questrial',
            fontSize: '1.0em',
            fill: '#4F545A',
            textAnchor: 'left'
        }

    }))
    const classes = useStyles()
    const color_url = "url(#" + '#004666' + ")"
    const area_color_url = "url(#" + '#41C0EB' + ")"


    // Get address of outout label selected from dropdown
    const outCat = props.outputs.find(output => (output.category === props.currCategory))
    const getOutAdd = () => {
        let outAdd
        if (props.currOutputCell === '') {
            outAdd = Object.keys(outCat.labels)[0]
        } else {
            outAdd = props.currOutputCell
        }
        return outAdd
    }
    const outAdd = getOutAdd()
    const outAdd_fmt = props.formats[outAdd]
    const probs = props.distributions.prob[outAdd]

    const processCases = () => {
        return Object.entries(props.cases[0]).reduce((acc, caseData) => {
            const caseName = caseData[0]
            const inputCombo = caseData[1]
            const caseOutVal = props.findSolution(inputCombo)[outAdd]
            acc[caseName] = [caseOutVal, probs[caseOutVal][1]]
            return acc
        }, {'Current': [props.currSolution[outAdd], probs[props.currSolution[outAdd]][1]]})
    }

    const createRefBars = (caseVals, yAxisId) => {
        return Object.entries(caseVals).map((caseVal) => {
            let labelposition
            let labelfill
            let labelWeight
            let labelvalue
            let labelwidth
            if (caseVal[0] === "Current") {
                labelposition = "top"
                labelfill = '#A5014B'
                labelWeight = 500
                labelwidth=2
            } else {
                labelposition = "insideLeft"
                labelfill = '#004666'
                labelWeight = 350
                labelwidth=1.5
            }
            if (yAxisId === 'pdf') {
                labelvalue = caseVal[0] + ": " + convert_format("0.0%", caseVal[1][1])
            } else {
                labelvalue = caseVal[0] + ": " + convert_format(outAdd_fmt, caseVal[1][0])
            }

            return <ReferenceLine
                key={caseVal[0]}
                yAxisId={yAxisId}
                x={caseVal[1][0]}
                stroke={labelfill}
                strokeWidth={labelwidth}
                label={{
                    position: labelposition,
                    value: labelvalue,
                    fontFamily: 'Questrial',
                    fontSize: '0.9em',
                    fill: labelfill,
                    width: '10px',
                    fontWeight: labelWeight,
                    background: 'yellow'
                }}
                isFront={true}
                ifOverflow="extendDomain"
            />
        })
    }

    const createProbData = (probs, counts) => {
        return Object.entries(probs).map(ValProbPair => {
            const outVal = parseFloat(ValProbPair[0])
            const pdf = ValProbPair[1][0]

            return ({
                value: outVal,
                pdf: pdf
            })
        })
    }

    const createBinCenters = (counts) => {
        const bin_edges = props.distributions.bin_edges[outAdd]
        let bin_centers = bin_edges.map((edge, idx) => {
            if (idx < bin_edges.length - 1) {
                return (edge + bin_edges[idx + 1]) / 2
            }
        })
        return bin_centers.slice(0, bin_centers.length - 1)
    }

    const createHistogramData = (bin_centers, counts) => {
        return bin_centers.map((center, idx) => {
            return {
                value: center,
                count: counts[idx]
            }
        })
    }

    const AxisFormatter = (fmt, value) => convert_format(fmt, value)

    //Tick formatter
    const CustomizedXAxisTick = (props) => {
        const {x, y, payload, fmt} = props

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="middle"
                    fill='#3C4148'
                    transform="rotate(-0)"
                    fontSize='0.9em'
                    fontFamily="Questrial"
                    fontWeight='500'
                >
                    {AxisFormatter(fmt, payload.value)}
                </text>
            </g>
        )
    }

    const generateHistChart = (outAdd, caseVals) => {
        const counts = props.distributions.count[outAdd]
        const bin_centers = createBinCenters(counts)
        const hist_data = createHistogramData(bin_centers, counts)
        const referenceBars = createRefBars(caseVals, "count")

        return (
            <Paper className={classes.paper}>
                <h3 className={classes.chartTitle}>Histogram for {outCat.labels[outAdd]}, {props.currCategory}</h3>
                <h3 className={classes.chartNote}><em>Represents relative frequency of values assuming a standrard bin width</em></h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={hist_data}
                        margin={{top: 50, right: 100, left: 100, bottom: 0}}
                        barSize={20}
                        style={{background: 'linear-gradient(#FFFFFF 60%,#F4F4F4)'}}
                    >
                        <defs>
                            <linearGradient id={'#004666'} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={'#004666'} stopOpacity={0.6}/>
                                <stop offset="75%" stopColor={'#004666'} stopOpacity={0.4}/>
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="value"
                            type="number"
                            tick={<CustomizedXAxisTick fmt={outAdd_fmt}/>}
                            ticks={bin_centers}
                            // tickLine={false}
                            interval={0}
                            // padding={{top: 30, bottom: 30}}
                            stroke='#3C4148'
                            scale="linear"
                            domain={[props.distributions.min[outAdd], props.distributions.max[outAdd]]}
                        />
                        <Label
                            value={`${props.inputLabelMap[outAdd]}`}
                            position="bottom"
                            className={classes.xlabel}
                        />
                        <YAxis
                            yAxisId="count"
                            hide={true}/>
                        <Tooltip/>
                        {referenceBars}
                        <Bar
                            yAxisId="count"
                            dataKey="count"
                            fill={color_url}
                            isAnimationActive={false}>
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        )
    }

    const generateProbChart = (outAdd, caseVals) => {
        const prob_data = createProbData(probs)
        const referenceBars = createRefBars(caseVals, "pdf")


        //Combine with cases
        prob_data.sort((a, b) => a.value - b.value)


        return (
            <Paper className={classes.paper}>
                <h3 className={classes.chartTitle}>Estimated Probability Distribution for {outCat.labels[outAdd]}, {props.currCategory}</h3>
                <h3 className={classes.chartNote}><em>Represents probability of achievement</em></h3>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart
                        data={prob_data}
                        margin={{top: 50, right: 100, left: 100, bottom: 0}}
                        barSize={20}
                    >
                        <defs>
                            {/*<linearGradient id={'#41C0EB'} x1="0" y1="0" x2="0" y2="1">*/}
                            <linearGradient id={'#41C0EB'} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="value"
                            type="number"
                            tick={<CustomizedXAxisTick fmt={outAdd_fmt}/>}
                            // ticks={bin_centers}
                            tickLine={false}
                            interval="preserveStartEnd"
                            padding={{top: 30, bottom: 30}}
                            stroke='#3C4148'
                            // scale="linear"
                            domain={[props.distributions.min[outAdd], props.distributions.max[outAdd]]}
                        />
                        <Label
                            value={`${props.inputLabelMap[outAdd]}`}
                            position="bottom"
                            className={classes.xlabel}
                        />
                        <YAxis yAxisId="pdf"
                               orientation='right'
                               hide={true}
                        />
                        {/*<YAxis yAxisId="cdf" orientation='right'/>*/}
                        <Tooltip/>
                        {/*<Legend/>*/}
                        {referenceBars}
                        <Area yAxisId="pdf"
                              type="monotone"
                              dataKey="pdf"
                              fill={area_color_url}
                              stroke="#82ca9d"
                              connectNulls={true}
                              isAnimationActive={false}/>
                    </AreaChart>
                </ResponsiveContainer>
            </Paper>
        )
    }


    //Execute Functions
    const caseVals = processCases()
    const histChart = generateHistChart(outAdd, caseVals)
    const probChart = generateProbChart(outAdd, caseVals)

    return (
        <Card className={classes.saCard} key={"dist" + props.currOutputCell}>
            <div className={classes.cardHeaderContainer}>
                <h2 className={classes.cardTitleHeader}>Output Distributions</h2>
            </div>
            <LabelSelector outputs={props.outputs}
                           handleOutputLabelChange={props.handleOutputLabelChange}
                           handleOutputCategoryChange={props.handleOutputCategoryChange}
                           currOutputCell={props.currOutputCell}
                           currCategory={props.currCategory}/>
            {histChart}
            {probChart}
        </Card>
    )

}
