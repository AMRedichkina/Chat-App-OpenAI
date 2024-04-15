import React from 'react';
import { Comment, Icon } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';
import barChartOptions from './barChatOptions';
import botAvatar from '../../../../public/avatar_1.png';

const ChartMessage = ({ msg, downloadChart }) => (
    <>
      <Comment.Avatar
        className='avatar-placeholder'
        style={{ backgroundImage: `url(${botAvatar})` }}/>
      <div className="chart-container">
        <Bar id={`chart-${msg.id}`} data={msg.data} options={barChartOptions(msg.data)} />
        <Icon name="download" className="download-icon" onClick={() => downloadChart(msg.id)} />
      </div>
    </>
  );

export default ChartMessage;