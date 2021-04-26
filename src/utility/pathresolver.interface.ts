export { IPathResolver };

interface IPathResolver {
    getPathByName(name: string): string | undefined;
}
