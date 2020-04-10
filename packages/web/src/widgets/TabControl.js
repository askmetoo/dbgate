import React from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import theme from '../theme';

const TabItem = styled.div`
  border-right: 1px solid white;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:hover {
    color: ${theme.tabsPanel.hoverFont};
  }
  background-color: ${(props) =>
    // @ts-ignore
    props.selected ? theme.mainArea.background : 'inherit'};
`;

const TabNameWrapper = styled.span`
  margin-left: 5px;
`;

// visibility: ${(props) =>
//   // @ts-ignore
//   props.tabVisible ? 'visible' : 'none'};

const TabContainer = styled.div`
  position: absolute;
  display: flex;
  left: 0;
  right: 0
  top: 0;
   bottom: 0;

  ${(props) =>
    // @ts-ignore
    !props.tabVisible && `visibility: hidden;`}
`;

const TabsContainer = styled.div`
  display: flex;
  height: ${theme.tabsPanel.height}px;
  right: 0;
  background-color: ${theme.tabsPanel.background};
`;

const TabContentContainer = styled.div`
  flex: 1;
  position: relative;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`;

export function TabPage({ key, label, children }) {
  return children;
}

export function TabControl({ children }) {
  const [value, setValue] = React.useState(0);

  // const [mountedTabs, setMountedTabs] = React.useState({});

  const childrenArray = (_.isArray(children) ? _.flatten(children) : [children]).filter((x) => x);

  // // cleanup closed tabs
  // if (_.difference(_.keys(mountedTabs), _.map(childrenArray, 'props.key')).length > 0) {
  //   setMountedTabs(_.pickBy(mountedTabs, (v, k) => childrenArray.find((x) => x.props.key == k)));
  // }

  return (
    <MainContainer>
      <TabsContainer>
        {childrenArray
          .filter((x) => x.props)
          .map((tab, index) => (
            // @ts-ignore
            <TabItem key={index} onClick={() => setValue(index)} selected={value == index}>
              <TabNameWrapper>{tab.props.label}</TabNameWrapper>
            </TabItem>
          ))}
      </TabsContainer>
      <TabContentContainer>
        {childrenArray.map((tab, index) => {
          const tabVisible = index == value;
          return (
            <TabContainer
              // @ts-ignore
              tabVisible={tabVisible}
              key={tab.props.key}
            >
              {childrenArray[index] && childrenArray[index].props.children}
            </TabContainer>
          );
        })}
      </TabContentContainer>
    </MainContainer>
  );
}