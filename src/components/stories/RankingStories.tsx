import styled from "styled-components";
import api from "../../services/tuys";
import { RequestKeyEnum } from "../utils/enums";
import { useRequestQuery, useToast } from "../../hooks";
import { Story } from "./Story";

export function RankingStories() {
	const toast = useToast();

	const {
		isError,
		isSuccess,
		data: stories,
		...request
	} = useRequestQuery([RequestKeyEnum.ranking], () => api.getRanking());

	if (isError) {
		toast({
			type: "error",
			text:
				request.error ||
				"Não foi possível carregar o ranking. Por favor, recarregue a página.",
		});
		return null;
	}

	if (!stories) {
		return null;
	}

	return (
		<StoriesWrapper>
			<div>
				{stories.map((story, index) => (
					<div key={index}>
						<Division>
							<span>{index + 1}</span>
							<div></div>
						</Division>
						<Story story={story} showChannel={true} />
					</div>
				))}
			</div>
		</StoriesWrapper>
	);
}

const StoriesWrapper = styled.section`
	width: 100%;
	height: 100%;
	margin: 0 auto;

	> div {
		display: flex;
		align-items: center;
		justify-content: initial;
		flex-wrap: wrap;
		margin-bottom: 80px;

		> div {
			width: 100%;
			margin-top: 20px;
		}
	}

	@media (max-width: 345px) {
		> div {
			justify-content: center;
		}
	}
`;

const Division = styled.div`
	&& {
		width: 100%;
		display: flex;
		align-items: center;

		> span {
			font-size: 1.2rem;
			color: ${(props) => props.theme.colors.text};
			margin-right: 10px;
		}

		> div {
			width: 100%;
			height: 1px;
			background-color: ${(props) => props.theme.colors.text};
		}

		@media (max-width: 500px) {
			> span {
				font-size: 1rem;
			}
		}
	}
`;
