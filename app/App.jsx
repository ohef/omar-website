import React from "react"


import "./style.css"
import styled from "styled-components"

export default (props) => {
    return (
        <FlexContainer>
            <div style={{filter: "url(#blur)", width: "100%", height: "100%", position: "absolute", zIndex : -1}}>
                <svg style={{width: "100%", height: "100%", position: "absolute"}}>
                    <defs>
                        <filter id="blur">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="30"/>
                        </filter>
                    </defs>
                    <Ellipse/>
                </svg>
            </div>
            <FlexRow>
                <NameText color={"#a1a1a1"}>Omar</NameText>
                <NameText color={"#e6e6e6"}>Hefnawi</NameText>
                <Bar/>
                <FlexColumn>
                    <Link href="https://github.com/ohef">GitHub</Link>
                    <Link href="https://www.linkedin.com/in/omar-hefnawi-04110661/">LinkedIn</Link>
                </FlexColumn>
            </FlexRow>
        </FlexContainer>
    )
}

const FlexContainer = styled.div`
    display: -webkit-box;  /* OLD - iOS 6-, Safari 3.1-6, BB7 */
    display: -ms-flexbox;  /* TWEENER - IE 10 */
    display: -webkit-flex; /* NEW - Safari 6.1+. iOS 7.1+, BB10 */
    display: flex;         /* NEW, Spec - Firefox, Chrome, Opera */

    justify-content: center;
    align-items: center;
    margin: 0; 
    padding: 0;

    height : 100vh;
`

const FlexRow = styled.div`
    display: flex;
    flex-direction: column;
`

const FlexColumn = styled.div`
    display: flex;
`

const NameText = styled.div`
    text-align: center;
    font-family: LemonMilk;
    font-size: 3em;
    line-height: 0.83;
    user-select: none;
    color: ${props => props.color}
`

const Bar = styled.div`
    margin-top: 3px;
    width: 500px; 
    height: 2px; 
    background-image: linear-gradient(90deg, rgba(1.0,1.0,1.0,0.0), #FFFFFF, rgba(1.0,1.0,1.0,0.0) );
`

const Link = styled.a`
    color: #e6e6e6;
    font-family: LemonMilk;
    flex: 1;
    text-align: center;
    text-decoration: none;
`

const Ellipse = styled.ellipse`
    fill:rgba(0,0,0,1.0);
    cx:50%;
    cy:50%;
    rx:200;
    ry:100;
`

