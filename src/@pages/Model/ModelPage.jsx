import React, { useState } from 'react';
import * as R from 'ramda';
import styled from 'styled-components';
import { useTrail } from 'react-spring';
import * as GraphqlService from '@services/graphql-service';
import {
    Button,
    CommentsForModel,
    TagsBox,
    Viewer,
    ColorPicker,
} from '@components';

const graphqlService = GraphqlService.getInstance();

const Name = styled.h1`
    border-right: 2px solid ${props => props.theme.black};
    padding-right: 8px;
    margin: 0 8px 0 0;
`;

const OwnerStyled = styled.h3`
    padding-top: 2px;
    margin: 0;
`;

const Comments = styled(CommentsForModel)`
    grid-area: footer;
`;

const Likes = ({ likes }) => {
    const amount = likes.filter(fields => fields.isLiked).length;
    return <div>Likes: {amount}</div>;
};

const ViewerArea = styled.div`
    display: grid;
    height: 100%;
    position: relative;
    grid-template-columns: 85% 15%;
    grid-template-rows: 10% 75% 15%;
    grid-template-areas:
        'header  header'
        'viewer  sidebar'
        'footer  footer';
`;

const Info = styled.div`
    position: absolute;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-around;
    width: 12vw;
    height: 13vw;
    background: white;
    z-index: 1;
    top: 13%;
    right: 16.5%;
    box-shadow: inset 0 0 0 3px black;

    > div {
        margin-left: 1vw;
    }
`;

const Owner = ({ owner }) => {
    if (!owner) {
        return null;
    }

    return (
        <OwnerStyled>
            Uploaded By: {owner.firstName} {owner.lastName}
        </OwnerStyled>
    );
};

const HeaderStyled = styled.div`
    grid-area: header;
    display: flex;
    align-items: center;
`;

const Header = ({ model, user }) => {
    const { owner, name } = model;
    return (
        <HeaderStyled>
            <Name>{name}</Name>
            <Owner owner={owner} />
            <Likes likes={model.likes} />
            <ButtonForLikes user={user} model={model} />
        </HeaderStyled>
    );
};

const userIdsWhoHaveLiked = R.pipe(
    R.prop('likes'),
    R.filter(R.propEq('isLiked', true)),
    R.map(R.path(['owner', 'id'])),
);

const hasLikedModel = (model, user) => {
    return R.includes(user.id, userIdsWhoHaveLiked(model));
};

const LikeButton = ({ model, user }) => {
    const [likeModel] = graphqlService.useLikeModelMutation(user.id, model.id);
    return <Button onClick={likeModel}>Like</Button>;
};
const DisabledLikeButton = () => {
    return <Button disabled>Like</Button>;
};

const UnlikeButton = ({ model, user }) => {
    const [unlikeModel] = graphqlService.useUnlikeModelMutation(
        user.id,
        model.id,
    );
    return <Button onClick={unlikeModel}>Unlike</Button>;
};

const ButtonForLikes = ({ model, user }) => {
    if (!user) {
        return <DisabledLikeButton />;
    } else if (hasLikedModel(model, user)) {
        return <UnlikeButton model={model} user={user} />;
    }
    return <LikeButton model={model} user={user} />;
};

const ViewerContainer = styled.div`
    box-shadow: inset 0 0 0 5px black;
    pointer-events: none;
    grid-area: viewer;
    display: flex;

    > div {
        pointer-events: all;
    }
`;

const Interactions = styled.div`
    position: absolute;
    display: flex;
    width: 12vw;
    height: 7vw;
    bottom: 17%;
    right: 16%;
    background: white;
    box-shadow: inset 0 0 0 3px black;
`;

const DisplayOptions = styled.div`
    position: absolute;
    bottom: 17%;
    left: 1%;
    display: flex;
    flex-flow: row nowrap;
    align-items: flex-end;

    > div {
        margin-right: 15px;
    }
`;

const DisplayButton = styled(Button)`
    max-width: 100%;
    width: auto;
`;

const Menu = styled.div`
    display: flex;
    flex-flow: column nowrap;
    grid-area: sidebar;
    padding: 5%;
    justify-content: flex-start;
    align-items: center;
`;

const Tags = styled.div`
    background: green;
    width: 90%;
    height: 50%;
    margin-top: 5%;
`;

const ModelViewer = ({ model, user }) => {
    const [mode, setMode] = useState('shaded');
    const [meshColor, setMeshColor] = useState('#FFFFFF');
    const [wireColor, setWireColor] = useState('#000000');

    const tags = [
        { name: 'Yormy' },
        { name: 'Grimgooorsh' },
        { name: 'AB' },
        { name: 'Longish' },
        { name: 'Real long Tag' },
        { name: 'Screw' },
        { name: 'Bolt' },
        { name: 'Automotive' },
        { name: 'Clasp' },
        { name: 'Physna' },
        { name: 'Thangs.com' },
        { name: 'Boat' },
        { name: 'Trucks' },
        { name: 'Civil Engineering' },
        { name: '3D Printing' },
        { name: 'Yormy' },
    ];

    const names = ['Download', 'Share', 'Match', 'Identify'];

    const changeMode = targetMode => {
        setMode(targetMode);
    };

    const changeMeshColor = (color, event) => {
        setMeshColor(color.hex);
    };

    const changeWireColor = (color, event) => {
        setWireColor(color.hex);
    };

    const config = { mass: 5, tension: 2000, friction: 200 };
    const trail = useTrail(names.length, {
        config,
        to: { opacity: 1, transform: 'translate(0,0)' },
        from: { opacity: -2, transform: 'translate(300%,0)' },
    });

    return (
        <>
            <ViewerContainer>
                <Info>
                    <DisplayButton
                        onClick={() => {
                            changeMode('shaded');
                        }}
                        name="Shaded"
                    />
                    <DisplayButton
                        onClick={() => {
                            changeMode('wireframe');
                        }}
                        name="wireframe"
                    />
                    <DisplayButton
                        onClick={() => {
                            changeMode('composite');
                        }}
                        name="Composite"
                    />
                </Info>
                <Interactions />
                <DisplayOptions>
                    <ColorPicker color={meshColor} onChange={changeMeshColor} />
                    <ColorPicker color={wireColor} onChange={changeWireColor} />
                </DisplayOptions>
                <Viewer
                    url="http://127.0.0.1:8000/model"
                    mode={mode}
                    meshColor={meshColor}
                    wireFrameColor={wireColor}
                />
            </ViewerContainer>
            <Menu>
                {trail.map((props, index) => {
                    return (
                        <Button
                            key={names[index]}
                            name={names[index]}
                            style={props}
                            maxwidth="90%"
                            height="10%"
                            fontSize="1.5rem"
                        />
                    );
                })}
                <Tags>
                    <TagsBox width="100%" height="100%" data={tags} />
                </Tags>
            </Menu>
        </>
    );
};

const ModelPage = ({ model, user }) => {
    return (
        <ViewerArea>
            <Header model={model} user={user} />
            <ModelViewer model={model} user={user} />
            <Comments model={model} />
        </ViewerArea>
    );
};

export { ModelPage };
