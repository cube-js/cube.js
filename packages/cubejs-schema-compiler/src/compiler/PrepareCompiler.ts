import { SchemaFileRepository } from '@cubejs-backend/shared';
import { NativeInstance } from '@cubejs-backend/native';
import { v4 as uuidv4 } from 'uuid';

import { CubeValidator } from './CubeValidator';
import { DataSchemaCompiler } from './DataSchemaCompiler';
import {
  CubeCheckDuplicatePropTranspiler,
  CubePropContextTranspiler,
  ImportExportTranspiler,
  TranspilerInterface,
  ValidationTranspiler,
} from './transpilers';
import { Funnels, RefreshKeys, Reflection } from '../extensions';
import { CubeSymbols } from './CubeSymbols';
import { CubeDictionary } from './CubeDictionary';
import { CubeEvaluator } from './CubeEvaluator';
import { ContextEvaluator } from './ContextEvaluator';
import { JoinGraph } from './JoinGraph';
import { CubeToMetaTransformer } from './CubeToMetaTransformer';
import { CompilerCache } from './CompilerCache';
import { YamlCompiler } from './YamlCompiler';
import { ViewCompilationGate } from './ViewCompilationGate';

export type PrepareCompilerOptions = {
  nativeInstance?: NativeInstance,
  allowNodeRequire?: boolean;
  allowJsDuplicatePropsInSchema?: boolean;
  maxQueryCacheSize?: number;
  maxQueryCacheAge?: number;
  compileContext?: any;
  standalone?: boolean;
  headCommitId?: string;
  adapter?: string;
};

export const prepareCompiler = (repo: SchemaFileRepository, options: PrepareCompilerOptions = {}) => {
  const nativeInstance = options.nativeInstance || new NativeInstance();
  const cubeDictionary = new CubeDictionary();
  const cubeSymbols = new CubeSymbols();
  const viewCompiler = new CubeSymbols(true);
  const viewCompilationGate = new ViewCompilationGate();
  const cubeValidator = new CubeValidator(cubeSymbols);
  const cubeEvaluator = new CubeEvaluator(cubeValidator);
  const contextEvaluator = new ContextEvaluator(cubeEvaluator);
  const joinGraph = new JoinGraph(cubeValidator, cubeEvaluator);
  const metaTransformer = new CubeToMetaTransformer(cubeValidator, cubeEvaluator, contextEvaluator, joinGraph);
  const { maxQueryCacheSize, maxQueryCacheAge } = options;
  const compilerCache = new CompilerCache({ maxQueryCacheSize, maxQueryCacheAge });
  const yamlCompiler = new YamlCompiler(cubeSymbols, cubeDictionary, nativeInstance, viewCompiler);

  const transpilers: TranspilerInterface[] = [
    new ValidationTranspiler(),
    new ImportExportTranspiler(),
    new CubePropContextTranspiler(cubeSymbols, cubeDictionary, viewCompiler),
  ];

  if (!options.allowJsDuplicatePropsInSchema) {
    transpilers.push(new CubeCheckDuplicatePropTranspiler());
  }

  const compiler = new DataSchemaCompiler(repo, Object.assign({}, {
    cubeNameCompilers: [cubeDictionary],
    preTranspileCubeCompilers: [cubeSymbols, cubeValidator],
    transpilers,
    viewCompilationGate,
    viewCompilers: [viewCompiler],
    cubeCompilers: [cubeEvaluator, joinGraph, metaTransformer],
    contextCompilers: [contextEvaluator],
    cubeFactory: cubeSymbols.createCube.bind(cubeSymbols),
    compilerCache,
    extensions: {
      Funnels,
      RefreshKeys,
      Reflection
    },
    compileContext: options.compileContext,
    standalone: options.standalone,
    nativeInstance,
    yamlCompiler,
  }, options));

  return {
    compiler,
    metaTransformer,
    cubeEvaluator,
    contextEvaluator,
    joinGraph,
    compilerCache,
    headCommitId: options.headCommitId,
    compilerId: uuidv4(),
  };
};

export const compile = (repo: SchemaFileRepository, options?: PrepareCompilerOptions) => {
  const compilers = prepareCompiler(repo, options);
  return compilers.compiler.compile().then(
    () => compilers
  );
};
