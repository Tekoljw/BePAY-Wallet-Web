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
          x: Number(item.createTime*1000),
          y: item.curInterestValue
        }
      })
    }
    const chartInfoArr = [{
      data: tempData,
      name: '日利率'
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
        enabled: true,
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
        top: 0,
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
      curve: 'smooth'
    },
    tooltip: {
      followCursor: true,
      theme: 'dark',
      x: {
        formatter: function (value) {
          // 如果需要完全自定义，可以直接使用 timestamp
          const date = new Date(value);
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }
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
      // tickAmount: 5,
      // tooltip: {
      //   enabled: true,
      // },
      labels: {
        offsetY: -20,
        style: {
          colors: contrastTheme.palette.text.secondary,
        },
        datetimeFormatter: {
          year: 'yyyy',         // 年份格式
          month: 'yyyy-MM',     // 月份格式
          day: 'yyyy-MM-dd',    // 日期格式
        },
        formatter: function (value, timestamp) {
          // 如果需要完全自定义，可以直接使用 timestamp
          const date = new Date(timestamp);
          return `${date.getMonth() + 1}-${date.getDate()}`;
        }
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
      min: (min) => min - 0.1,
      max: (max) => max + 0.1,
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
