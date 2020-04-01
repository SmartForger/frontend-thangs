import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import * as R from 'ramda';

import { WithNewThemeLayout } from '@style';
import * as GraphqlService from '@services/graphql-service';

const graphqlService = GraphqlService.getInstance();

function Page() {
    return <div>Hello World</div>;
}

const EditProfile = WithNewThemeLayout(Page);

export { EditProfile };
