import React, { useState } from 'react';
import './header.css';
import { Container, Icon, Dropdown } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';
import { clearMessages } from '../../../store/slices/messageSlice';

const Header = React.memo(({ onHashtagAdded }) => {
    console.log("render header");
    const dispatch = useDispatch();
    const [dropdownKey, setDropdownKey] = useState(0);
    const hashtags = [
        { key: 'diagram', text: '#diagram', value: '#diagram' },
    ];

    const addHashtag = (e, { value }) => {
        onHashtagAdded((inputValue) => {
            const newValue = value.trim() + ' ' + inputValue;
            dispatch(setInputValue(newValue));
            setDropdownKey(prevKey => prevKey + 1);
        });
    };
    
    return (
        <Container text fluid className="chat-container-header">
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Dropdown
                    key={dropdownKey}
                    className='icon dropdown'
                    options={hashtags}
                    onChange={addHashtag}
                    trigger={<Icon name='hashtag' className='hashtag-icon'/>}
                    pointing='top right'
                    icon={null}
                />
                <Icon className='delete-icon' name='delete' link onClick={() => dispatch(clearMessages())} />
            </div>
        </Container>
    );
});

export default Header;
