import React, { useCallback } from 'react';
import { Comment, Icon } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
import html2canvas from 'html2canvas';

import barChartOptions from './barChatOptions';
import botAvatar from '../../../../public/avatar_1.png';

/**
 * A memoized component for displaying chart messages.
 * 
 * This component renders a bar chart message along with an option to download the chart image.
 * It utilizes memoization to prevent unnecessary re-renders.
 * 
 * @param {Object} msg - The chart message object containing chart data and other properties.
 * @returns {JSX.Element} The rendered chart message.
 */
const ChartMessage = React.memo(({ msg }) => {
  /**
  * Callback function to download the chart image.
  * 
  * This function uses html2canvas to convert the chart into an image and triggers a download of the image.
  * 
  * @param {string} chartId - The ID of the chart element to be downloaded.
  */
  const downloadChart = useCallback((chartId) => {
    const chartElement = document.getElementById(`chart-${chartId}`);
    html2canvas(chartElement).then((canvas) => {
      const image = canvas.toDataURL('image/jpeg', 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `chart-${chartId}.jpg`;
      link.click();
    });
  });

  // Render a placeholder in test mode
  if (process.env.NODE_ENV === 'test') {
    return <div>Chart not rendered in test mode</div>;
  }

  return <>
    <Comment.Avatar
      className='chat__avatar-placeholder'
      style={{ backgroundImage: `url(${botAvatar})` }} />
    <div className="chat__chart-container">
      <Bar id={`chart-${msg.id}`} data={msg.data} options={barChartOptions(msg.data)} />
      <Icon name="download" className="download-icon" onClick={() => downloadChart(msg.id)} />
    </div>
  </>
});

export default ChartMessage;