import { useSelector } from 'react-redux';
import { styled, ThemeProvider, useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { selectContrastMainTheme } from 'app/store/fuse/settingsSlice';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { selectWidgets } from '../store/widgetsSlice';

const Root = styled(Paper)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

function VisitorsOverviewWidget(props) {
  const { demandInterestHistory = [] } = props;
  const theme = useTheme();
  const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));
  const widgets = useSelector(selectWidgets);
  const { series, ranges } = widgets?.visitors;
  const [tabValue, setTabValue] = useState(0);
  const currentRange = Object.keys(ranges)[tabValue];
  const [chartData, setChartData] = useState([])
  
  useEffect(()=>{
    let tempData = []
    if(demandInterestHistory.length> 0) {
      tempData = demandInterestHistory.map((item)=>{
        return {
          x: d.createTime,
          y: d.todayInterestValue
        }
      })
    }
    const chartInfoArr = [{
      data: tempData,
      name: chartData.name
    }]
    setChartData(chartInfoArr)
  }, [demandInterestHistory])

  const chartOptions = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      width: '100%',
      height: '100%',
      type: 'area',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [contrastTheme.palette.secondary.light],
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: [contrastTheme.palette.secondary.dark],
    },
    grid: {
      show: true,
      borderColor: contrastTheme.palette.divider,
      padding: {
        top: 10,
        bottom: -40,
        left: 0,
        right: 0,
      },
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    stroke: {
      width: 2,
    },
    tooltip: {
      followCursor: true,
      theme: 'dark',
      x: {
        format: 'MMM dd, yyyy',
      },
      y: {
        formatter: (value) => `${value}`,
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        stroke: {
          color: contrastTheme.palette.divider,
          dashArray: 0,
          width: 2,
        },
      },
      labels: {
        offsetY: -20,
        style: {
          colors: contrastTheme.palette.text.secondary,
        },
      },
      tickAmount: 20,
      tooltip: {
        enabled: false,
      },
      type: 'datetime',
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      min: (min) => min - 750,
      max: (max) => max + 250,
      tickAmount: 5,
      show: false,
    },
  };

  return (
    <ThemeProvider theme={contrastTheme}>
      <Root className="sm:col-span-2 lg:col-span-3 dark flex flex-col flex-auto shadow  overflow-hidden mt-20" style={{ borderRadius: "10px" }}>
        <div className="flex flex-col flex-auto" style={{ height: "190px" }}>
          <ReactApexChart
            options={chartOptions}
            series={ chartData }
            type={chartOptions.chart.type}
            height={chartOptions.chart.height}
          />
        </div>
      </Root>
    </ThemeProvider>
  );
}

export default VisitorsOverviewWidget;
