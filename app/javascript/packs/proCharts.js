import Loadable from 'react-loadable';

const loading = import('../src/components/Loading.jsx');

const CoadableReactionsChart = Loadable({
  loader: () => import('../src/components/CommentsChart.js'),
  loading: () => loading,
});

const LoadableCommentsChart = Loadable({
  loader: () => import('../src/components/Chart.js'),
  loading: () => loading,
});

export const reactionsChart = new CoadableReactionsChart();
export const commentsChart = new LoadableCommentsChart();
