/**
 * @generated SignedSource<<4943c441f0a18f63c691a565344bcaf7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
export type AuthMethod = "LOCAL" | "OAUTH2";
import { FragmentRefs } from "relay-runtime";
export type ViewerContext_viewer$data = {
  readonly viewer: {
    readonly authMethod: AuthMethod;
    readonly email: string;
    readonly id: string;
    readonly profilePictureUrl: string | null;
    readonly role: {
      readonly name: string;
    };
    readonly username: string;
    readonly " $fragmentSpreads": FragmentRefs<"APIKeysTableFragment">;
  } | null;
  readonly " $fragmentType": "ViewerContext_viewer";
};
export type ViewerContext_viewer$key = {
  readonly " $data"?: ViewerContext_viewer$data;
  readonly " $fragmentSpreads": FragmentRefs<"ViewerContext_viewer">;
};

import ViewerContextRefetchQuery_graphql from './ViewerContextRefetchQuery.graphql';

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [],
      "operation": ViewerContextRefetchQuery_graphql
    }
  },
  "name": "ViewerContext_viewer",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "viewer",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "username",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "email",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "profilePictureUrl",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "UserRole",
          "kind": "LinkedField",
          "name": "role",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "name",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "authMethod",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "APIKeysTableFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};

(node as any).hash = "bec0ae2a629134a5b9afe1846eaec2c9";

export default node;
