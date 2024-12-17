import {
  DEFAULT_MODEL_NAME,
  DEFAULT_MODEL_PROVIDER,
} from "@phoenix/constants/generativeConstants";

import {
  _resetInstanceId,
  createPlaygroundInstance,
  getInitialInstances,
} from "../playgroundStore";
import { InitialPlaygroundState } from "../types";

describe("getInitialInstances", () => {
  beforeEach(() => {
    _resetInstanceId();
  });
  it("should return instances from initialProps if they exist", () => {
    const existingInstance = {
      ...createPlaygroundInstance(),
      model: {
        modelName: "test-model",
        provider: "OPENAI" as const,
        invocationParameters: [],
        supportedInvocationParameters: [],
      },
    };
    const initialProps: InitialPlaygroundState = {
      instances: [existingInstance],
      modelConfigByProvider: {},
    };

    const instances = getInitialInstances(initialProps);

    expect(instances).toEqual([existingInstance]);
  });

  it("should create a new default instance if no instances exist in initialProps and there are no saved modelConfigs", () => {
    const initialProps: InitialPlaygroundState = {
      modelConfigByProvider: {},
    };
    const instances = getInitialInstances(initialProps);

    expect(instances).toHaveLength(1);
    expect(instances[0].id).toBe(0);
    expect(instances[0].model.provider).toBe(DEFAULT_MODEL_PROVIDER);
    expect(instances[0].model.modelName).toBe(DEFAULT_MODEL_NAME);
  });

  it("should use saved model config if available", () => {
    const initialProps: InitialPlaygroundState = {
      modelConfigByProvider: {
        OPENAI: {
          modelName: "test-model",
          provider: "OPENAI",
          invocationParameters: [],
        },
      },
    };

    const instances = getInitialInstances(initialProps);

    expect(instances).toHaveLength(1);
    expect(instances[0].model.provider).toBe("OPENAI");
    expect(instances[0].model.modelName).toBe("test-model");
  });

  it("should use default model provider config if available", () => {
    const initialProps: InitialPlaygroundState = {
      modelConfigByProvider: {
        OPENAI: {
          modelName: "test-model-openai",
          provider: "OPENAI",
          invocationParameters: [],
        },
        ANTHROPIC: {
          modelName: "test-model-anthropic",
          provider: "ANTHROPIC",
          invocationParameters: [],
        },
      },
    };

    const instances = getInitialInstances(initialProps);

    expect(instances).toHaveLength(1);
    expect(instances[0].model.provider).toBe("OPENAI");
    expect(instances[0].model.modelName).toBe("test-model-openai");
  });

  it("should use any saved config if available if the default provider config is not", () => {
    const initialProps: InitialPlaygroundState = {
      modelConfigByProvider: {
        ANTHROPIC: {
          modelName: "test-model-anthropic",
          provider: "ANTHROPIC",
          invocationParameters: [],
        },
      },
    };

    const instances = getInitialInstances(initialProps);

    expect(instances).toHaveLength(1);
    expect(instances[0].model.provider).toBe("ANTHROPIC");
    expect(instances[0].model.modelName).toBe("test-model-anthropic");
  });
});
