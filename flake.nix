{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
    systems.url = "github:nix-systems/default";
    devenv.url = "github:cachix/devenv";
  };

  nixConfig = {
    extra-trusted-public-keys = "devenv.cachix.org-1:w1cLUi8dv3hnoSPGAuibQv+f9TZLr6cv/Hm9XgU50cw=";
    extra-substituters = "https://devenv.cachix.org";
  };

  outputs = { self, nixpkgs, devenv, systems, ... } @ inputs:
    let
      forEachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      packages = forEachSystem (system: {
        devenv-up = self.devShells.${system}.default.config.procfileScript;
      });

      devShells = forEachSystem
        (system:
          let
            pkgs = nixpkgs.legacyPackages.${system};
          in
          {
            default = devenv.lib.mkShell {
              inherit inputs pkgs;
              modules = [
                {
                  # https://devenv.sh/reference/options/
                  packages = [
                    pkgs.nodejs
                    pkgs.anki-bin # https://nixos.wiki/wiki/Anki
                  ];

                  # fo = flashcards-obsidian
                  scripts.fo-dev.exec = "npm install && npm run bootstrap && npm run dev";
                  scripts.fo-test.exec = "npm install && npm run test";
                  scripts.fo-reset-test-environment.exec = "cd $(git rev-parse --show-toplevel) && git checkout -- docs/test-vault/ tests/anki_base && git clean -fd tests/anki_base/flashcards-obsidian";
                  scripts.fo-build.exec = "npm install && npm run build";
                  # Assumes OSX only (for now)
                  scripts.fo-anki-for-testing.exec = "${pkgs.anki-bin.outPath}/Applications/Anki.app/Contents/MacOS/anki --base $(git rev-parse --show-toplevel)/tests/anki_base";

                  enterShell = ''
                    echo
                    echo "Run the scripts that are available in this environment:"
                    echo
                    echo fo-dev
                    echo fo-test
                    echo fo-build
                    echo
                    echo "Also:"
                    echo
                    echo fo-anki-for-testing
                    echo fo-reset-test-environment
                    echo
                    echo "fo-<tab> for more"
                  '';

                }
              ];
            };
          });
    };
}
