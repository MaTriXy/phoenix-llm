import numpy as np
import pandas as pd
from pandas import DataFrame

from phoenix.inferences import errors as err
from phoenix.inferences.schema import EmbeddingColumnNames, Schema
from phoenix.inferences.validation import validate_inferences_inputs

_NUM_RECORDS = 5
_EMBEDDING_DIMENSION = 7


def test_embeddings_vector_length_mismatch() -> None:
    input_dataframe = DataFrame(
        {
            "prediction_id": [str(x) for x in range(_NUM_RECORDS)],
            "timestamp": [pd.Timestamp.now() for x in range(_NUM_RECORDS)],
            "embedding_vector0": [np.zeros(_EMBEDDING_DIMENSION) for _ in range(_NUM_RECORDS)],
            "link_to_data0": [f"some-link{index}" for index in range(_NUM_RECORDS)],
            "raw_data_column0": [f"some-text{index}" for index in range(_NUM_RECORDS)],
        }
    )
    input_dataframe["embedding_vector0"].iloc[0] = np.zeros(_EMBEDDING_DIMENSION + 1)
    input_schema = Schema(
        prediction_id_column_name="prediction_id",
        timestamp_column_name="timestamp",
        embedding_feature_column_names={
            "embedding_feature0": EmbeddingColumnNames(
                vector_column_name="embedding_vector0",
                link_to_data_column_name="link_to_data0",
                raw_data_column_name="raw_data_column0",
            ),
        },
    )

    errors = validate_inferences_inputs(
        dataframe=input_dataframe,
        schema=input_schema,
    )
    assert len(errors) == 1
    assert isinstance(errors[0], err.EmbeddingVectorSizeMismatch)


def test_invalid_embeddings_vector_length() -> None:
    input_dataframe = DataFrame(
        {
            "prediction_id": [str(x) for x in range(_NUM_RECORDS)],
            "timestamp": [pd.Timestamp.now() for x in range(_NUM_RECORDS)],
            "embedding_vector0": [np.zeros(1) for _ in range(_NUM_RECORDS)],
            "link_to_data0": [f"some-link{index}" for index in range(_NUM_RECORDS)],
            "raw_data_column0": [f"some-text{index}" for index in range(_NUM_RECORDS)],
        }
    )
    input_schema = Schema(
        prediction_id_column_name="prediction_id",
        timestamp_column_name="timestamp",
        embedding_feature_column_names={
            "embedding_feature0": EmbeddingColumnNames(
                vector_column_name="embedding_vector0",
                link_to_data_column_name="link_to_data0",
                raw_data_column_name="raw_data_column0",
            ),
        },
    )

    errors = validate_inferences_inputs(
        dataframe=input_dataframe,
        schema=input_schema,
    )
    assert len(errors) == 1
    assert isinstance(errors[0], err.InvalidEmbeddingVectorSize)


def test_embeddings_vector_invalid_type() -> None:
    input_dataframe = DataFrame(
        {
            "prediction_id": [str(x) for x in range(_NUM_RECORDS)],
            "timestamp": [pd.Timestamp.now() for x in range(_NUM_RECORDS)],
            "embedding_vector0": "this is a string but must be a list, pd.Series or np.array type",
            "link_to_data1": [f"some-link{index}" for index in range(_NUM_RECORDS)],
            "raw_data_column1": [f"some-text{index}" for index in range(_NUM_RECORDS)],
            "embedding_vector1": [
                np.array(["abba" for _ in range(_EMBEDDING_DIMENSION)], dtype=object)
                for _ in range(_NUM_RECORDS)
            ],
            "link_to_data0": [f"some-link{index}" for index in range(_NUM_RECORDS)],
            "raw_data_column0": [f"some-text{index}" for index in range(_NUM_RECORDS)],
        }
    )
    input_schema = Schema(
        prediction_id_column_name="prediction_id",
        timestamp_column_name="timestamp",
        embedding_feature_column_names={
            "embedding_feature0": EmbeddingColumnNames(
                vector_column_name="embedding_vector0",
                link_to_data_column_name="link_to_data0",
                raw_data_column_name="raw_data_column0",
            ),
            "embedding_feature1": EmbeddingColumnNames(
                vector_column_name="embedding_vector1",
                link_to_data_column_name="link_to_data1",
                raw_data_column_name="raw_data_column1",
            ),
        },
    )

    errors = validate_inferences_inputs(
        dataframe=input_dataframe,
        schema=input_schema,
    )
    assert len(errors) == 2
    assert isinstance(errors[0], err.InvalidEmbeddingVectorDataType)
    assert isinstance(errors[1], err.InvalidEmbeddingVectorValuesDataType)


def test_embedding_reserved_columns() -> None:
    input_dataframe = DataFrame(
        {
            "prediction_id": [str(x) for x in range(_NUM_RECORDS)],
            "timestamp": [pd.Timestamp.now() for x in range(_NUM_RECORDS)],
            "embedding_vector": [np.random.rand(_EMBEDDING_DIMENSION) for _ in range(_NUM_RECORDS)],
            "raw_data_column": [f"some-text{index}" for index in range(_NUM_RECORDS)],
            "link_to_data": [f"some-link{index}" for index in range(_NUM_RECORDS)],
        }
    )
    input_schema = Schema(
        prediction_id_column_name="prediction_id",
        timestamp_column_name="timestamp",
        embedding_feature_column_names={
            "prompt": EmbeddingColumnNames(
                vector_column_name="embedding_vector",
                link_to_data_column_name="link_to_data",
                raw_data_column_name="raw_data_column",
            ),
            "response": EmbeddingColumnNames(
                vector_column_name="embedding_vector",
                link_to_data_column_name="link_to_data",
                raw_data_column_name="raw_data_column",
            ),
        },
    )
    errors = validate_inferences_inputs(
        dataframe=input_dataframe,
        schema=input_schema,
    )
    assert len(errors) == 0

    emb_col_names = EmbeddingColumnNames(
        vector_column_name="embedding_vector",
        raw_data_column_name="raw_data_column",
    )
    input_schema = input_schema.replace(prompt_column_names=emb_col_names)

    errors = validate_inferences_inputs(
        dataframe=input_dataframe,
        schema=input_schema,
    )
    assert len(errors) == 1
    assert isinstance(errors[0], err.InvalidEmbeddingReservedName)
    assert (
        errors[0].error_message()
        == err.InvalidEmbeddingReservedName("prompt", "schema.prompt_column_names").error_message()
    )

    input_schema = input_schema.replace(prompt_column_names=None)
    input_schema = input_schema.replace(response_column_names=emb_col_names)

    errors = validate_inferences_inputs(
        dataframe=input_dataframe,
        schema=input_schema,
    )
    assert len(errors) == 1
    assert isinstance(errors[0], err.InvalidEmbeddingReservedName)
    assert (
        errors[0].error_message()
        == err.InvalidEmbeddingReservedName(
            "response", "schema.response_column_names"
        ).error_message()
    )
