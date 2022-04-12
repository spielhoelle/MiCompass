import * as React from 'react';
import * as _ from "lodash"
import { DefaultNodeWidget, DefaultPortLabel } from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';

export const Port = styled.div`
		width: 16px;
		height: 16px;
		z-index: 10;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 8px;
		cursor: pointer;
		&:hover {
			background: rgba(0, 0, 0, 1);
		}
	`;


export const Node = styled.div`
		background-color: ${(p: { background: string }) => p.background};
		border-radius: 5px;
		font-family: sans-serif;
		color: white;
		border: solid 2px black;
		overflow: visible;
		font-size: 11px;
		border: solid 2px ${(p: any) => (p.selected ? 'rgb(0,192,255)' : 'black')};
		max-width: 220px;
	`;

export const Title = styled.div`
		background: rgba(0, 0, 0, 0.3);
		display: flex;
		white-space: normal;
		justify-items: center;
	`;

export const TitleName = styled.div`
		flex-grow: 1;
		padding: 5px 5px;
		white-space: pre-wrap;
		word-wrap: break-word;
	`;

export const Ports = styled.div`
		display: flex;
		background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
	`;

export const PortsContainer = styled.div`
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		&:first-of-type {
			margin-right: 10px;
		}
		&:only-child {
			margin-right: 0px;
		}
	`;

const Image = styled.img`
  pointer-events: none;
`
export class CustomNodeWidget extends DefaultNodeWidget {
	generatePort = (port) => {
		return <DefaultPortLabel engine={this.props.engine} port={port} key={port.getID()} />;
	};
	render() {
		return (
			<Node
				data-default-node-name={this.props.node.getOptions().name}
				selected={this.props.node.isSelected()}
				background={this.props.node.getOptions().color}>
				<Title>
					<TitleName>{`${this.props.node.getOptions().name}`}</TitleName>
				</Title>
				{this.props.node.getOptions().extras.image && this.props.node.getOptions().extras.image !== "" && (
					<Image className="w-100" src={this.props.node.getOptions().extras.image} />
				)}
				{this.props.node.getOptions().extras.customType === "question" && (
					<TitleName>Key: {this.props.node.getOptions().extras.questionidentifier}</TitleName>
				)}
				{this.props.node.getOptions().extras.customType === "question" && (
					<TitleName>DE trans: {this.props.node.getOptions().extras.questiontranslation}</TitleName>
				)}
				{this.props.node.getOptions().extras.customType === "answer" && this.props.node.getOptions().extras.dropdown && (
					<TitleName>Type: dropdown</TitleName>
				)}
				{this.props.node.getOptions().extras.customType === "answer" && this.props.node.getOptions().extras.answeridentifier && (
					<TitleName>Key: {this.props.node.getOptions().extras.answeridentifier}</TitleName>
				)}
				{this.props.node.getOptions().extras.customType === "answer" && this.props.node.getOptions().extras.answertranslation && (
					<TitleName>DE trans: {this.props.node.getOptions().extras.answertranslation}</TitleName>
				)}
				{this.props.node.getOptions().extras.customType === "answer" && !isNaN(this.props.node.getOptions().extras.points) && (
					<TitleName>Points: {this.props.node.getOptions().extras.points}</TitleName>
				)}
				<Ports>
					<PortsContainer>{_.map(this.props.node.getInPorts(), this.generatePort)}</PortsContainer>
					<PortsContainer>{_.map(this.props.node.getOutPorts(), this.generatePort)}</PortsContainer>
				</Ports>
			</Node>
		);
	}
}