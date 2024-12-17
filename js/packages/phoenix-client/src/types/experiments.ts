import { AnnotatorKind } from "./annotations";
import { Node } from "./core";
import { Example } from "./datasets";

/**
 * An experiment is a set of task runs on a dataset version
 */
export interface Experiment extends Node {
  datasetId: string;
  datasetVersionId: string;
  repetitions: number;
  /**
   * The project under which the experiment task traces are recorded
   */
  projectName: string;
}

/**
 * The result of running an experiment on a single example
 */
export interface ExperimentRun extends Node {
  startTime: Date;
  endTime: Date;
  /**
   * What experiment the run belongs to
   */
  experimentId: string;
  datasetExampleId: string;
  repetitionNumber: number;
  output?: string | Record<string, unknown> | null;
  error: string | null;
  traceId: string | null;
}

export type EvaluationResult = {
  score: number | null;
  label: string | null;
  metadata: Record<string, unknown>;
  explanation: string | null;
};

export interface ExperimentEvaluationRun extends Node {
  experimentRunId: string;
  startTime: Date;
  endTime: Date;
  /**
   * THe name of the evaluation
   */
  name: string;
  annotatorKind: AnnotatorKind;
  error: string | null;
  result: EvaluationResult | null;
  /**
   * The trace id of the evaluation
   * This is null if the trace is deleted or never recorded
   */
  trace_id: string | null;
}

export type TaskOutput = string | boolean | number | object | null;

export type ExperimentTask =
  | ((example: Example) => Promise<TaskOutput>)
  | ((example: Example) => TaskOutput);

export interface ExperimentParameters {
  /**
   * The number of examples to run the experiment on
   */
  nExamples: number;
  /**
   * The number of repetitions to run the experiment
   * e.g. the number of times to run the task
   */
  nRepetitions: number;
}
