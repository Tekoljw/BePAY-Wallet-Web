import { useSelector } from 'react-redux';
import Paper from '@mui/material/Paper';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import IconButton from '@mui/material/IconButton';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { selectWidgets } from '../store/widgetsSlice';


function Impressions(props) {

  const widgets = useSelector(selectWidgets);
  const { amount, series, labels } = {
    "amount": 17663,
    "labels": [
      "05 Jan - 12 Jan",
      "13 Jan - 20 Jan",
      "21 Jan - 28 Jan",
      "29 Jan - 05 Feb",
      "06 Feb - 13 Feb",
      "14 Feb - 21 Feb"
    ],
    "series": [
      {
        "name": "Expenses",
        "data": [
          4412,
          4345,
          4541,
          4677,
          4322,
          4123
        ]
      }
    ]
  }
  const theme = useTheme();

  const chartOptions = {
    chart: {
      animations: {
        enabled: false,
      },
      fontFamily: 'inherit',
      foreColor: 'inherit',
      height: '100%',
      type: 'line',
      sparkline: {
        enabled: true,
      },
    },
    colors: [theme.palette.secondary.main],
    stroke: {
      curve: 'smooth',
    },
    tooltip: {
      theme: 'dark',
    },
    xaxis: {
      type: 'category',
      categories: labels,
    },
    yaxis: {
      labels: {
        formatter: (val) => `$${val}`,
      },
    },
  };
  return (
    <Paper className="flex flex-col flex-auto p-12 shadow overflow-hidden" style={{ backgroundColor: "#1E293B", borderRadius: "10px", boxShadow: "0px 3px 3px rgba(0, 0, 0, 0.6)" }} >
      <div className="flex items-start justify-between mt-10">
        <div className="text-lg font-medium tracking-tight leading-6 truncate">BFT当前价格</div>
      </div>
      <div className="flex items-center mt-4">
        <div className="flex flex-col">
          <div className="text-3xl font-semibold tracking-tight leading-tight">
            {amount.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            })}
          </div>
          <div className="flex items-center mt-8">
            <FuseSvgIcon className="mr-4 text-green-500" size={20}>
              heroicons-solid:trending-down
            </FuseSvgIcon>
            <Typography className="font-medium text-sm text-secondary leading-none whitespace-nowrap">
              <span className="text-green-500 ">2%</span>
            </Typography>
          </div>
        </div>
        <div className="flex flex-col flex-auto ml-32">
          <ReactApexChart
            className="flex-auto w-full h-64"
            options={chartOptions}
            series={series}
            type={chartOptions.chart.type}
            height={chartOptions.chart.height}
          />
        </div>
      </div>
    </Paper>
  );

}

export default Impressions;
