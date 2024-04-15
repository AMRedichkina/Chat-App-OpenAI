import React from 'react';
import './header.css';
import { Container, Icon, Dropdown } from 'semantic-ui-react';

export default function Header ({setMessages, input, setInput}) {

    const hashtags = [
        { key: 'diagram', text: '#diagram', value: '#diagram' },
    ];

    const addHashtag = (e, { value }) => {
        setInput(prevInput => {
            prevInput = prevInput || '';
            return value.trim() + ' ' + prevInput
        });
    };

    return (
        <Container text fluid className="chat-container-header">
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Dropdown
                    key={input}
                    className='icon dropdown'
                    options={hashtags}
                    onChange={addHashtag}
                    trigger={<Icon name='hashtag' className='hashtag-icon'/>}
                    pointing='top right' 
                    icon={null}
                />
                <Icon className='delete-icon' name='delete' link onClick={() => setMessages([])} />
            </div>
        </Container>
    )
}
