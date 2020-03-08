import Loadable from 'react-loadable';

const loadableReactionsChart = Loadable({
  loader: () => import('../reactions.js'),
  loading: () => <div>Loading...</div>,
});

const loadableCommentsChart = Loadable({
  loader: () => import('../comments.js'),
  loading: () => <div>Loading...</div>,
});

export const reactionsChart = new loadableReactionsChart();

export const commentsChart = new loadableCommentsChart();
