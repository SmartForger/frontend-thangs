import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import {MdAccountCircle} from 'react-icons/md';
import {IoLogoDesignernews} from 'react-icons/io';
import {Shelf, ShelfButton} from './DropDownMenu';

const HeaderStyle = styled.div`
  position: fixed;    
  width: 85vw;
  height: 10vh;
  left: 50%;
  margin-left:-42.5vw;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.theme.white};
  z-index: 10;
`

const LogoStyle = styled.div`
  font-size: 64px;
  font-weight: 800;
  margin-left: 60px;
  color: ${props => props.theme.secondary};
  user-select: none;
  cursor: pointer;

  & > svg {
    color: ${props => props.theme.primary}
  }
`

const SearchStyle = styled.input`
  border: 0.5px solid ${props => props.theme.darkgrey};     
  padding: 15px;
  background: ${props => props.theme.grey};
  margin: 0 0 10px 0;
  width: 100%;
  font-size: 30px;

  ::placeholder {
    color: lightgrey;
  }
`
const ProfileStyle = styled.div`
  width: 17vw;
  height: 100%;
  background: ${props => props.theme.grey};
  display: flex;
  flex-flow: row nowrap;

  & > svg{
    height: 100%;
    width: 100%;
    color: ${props => props.theme.secondary};
  }
`

const ThangsHeader = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm,setSearchterm] = useState('');

  const handleChange = (e) => {
    e.persist();
    setSearchterm(e.target.value);
  }

  const performSearch = (e) => {
    alert(searchTerm);
    setSearchterm('');
    if (e) {
      e.preventDefault();
    }
  }

    return (
      <>
        <HeaderStyle>
            <Link to="/">
              <LogoStyle>
                <IoLogoDesignernews />
                thangs
              </LogoStyle>
            </Link>
            <form onSubmit={performSearch} style={{width: '50%'}}>
            <SearchStyle placeholder="Input search term" value={searchTerm} onChange={handleChange} />
            </form>
            <ProfileStyle>
              <ShelfButton open={open} setOpen={setOpen} />
              <MdAccountCircle />
            </ProfileStyle>
        </HeaderStyle>
        <Shelf open={open} setOpen={setOpen}/>
        </>);
    }
export { ThangsHeader };
