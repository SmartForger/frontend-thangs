import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { WithNewThemeLayout } from '@style';

const Page = () => <div>New Page</div>;

const Profile = WithNewThemeLayout(Page);

export { Profile };
