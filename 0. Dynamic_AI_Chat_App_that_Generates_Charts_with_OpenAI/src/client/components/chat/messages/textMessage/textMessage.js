import React from 'react';
import { Comment } from 'semantic-ui-react';
import botAvatar from '../../../../public/avatar_1.png';
import botUser from '../../../../public/avatar_2.png';

const TextMessage = ({ msg }) => (
    <>
      <Comment.Avatar
        className='avatar-placeholder'
        style={{ backgroundImage: `url(${msg.from === 'You' ? botUser : botAvatar})` }}/>
      <Comment.Text className='comment-text'>{msg.text}</Comment.Text>
    </>
  );

export default TextMessage;