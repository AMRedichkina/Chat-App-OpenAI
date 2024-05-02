import React, { useState } from 'react';
import { Container, Icon, Dropdown } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import './header.css';
import { clearMessages } from '../../../store/slices/messageSlice';

const Header = React.memo(({ onHashtagAdded }) => {
    const dispatch = useDispatch();

    const handleClearMessages = () => {
        dispatch(clearMessages());
    };
    const [dropdownKey, setDropdownKey] = useState(0);
    const hashtags = [
        { key: 'diagram', text: '#diagram', value: '#diagram' },
    ];

    const addHashtag = (e, { value }) => {
        onHashtagAdded(value);
        setDropdownKey(prevKey => prevKey + 1);
    };
    
    return (
        <Container text fluid className="chat-container-header">
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Dropdown
                    key={dropdownKey}
                    className='icon dropdown'
                    options={hashtags}
                    onChange={addHashtag}
                    trigger={<Icon name='hashtag' className='hashtag-icon' data-testid="hashtag-icon"/>}
                    pointing='top right'
                    icon={null}
                />
                <Icon className='delete-icon' data-testid="delete-icon" name='delete' link onClick={handleClearMessages} />
            </div>
        </Container>
    );
});

export default Header;
